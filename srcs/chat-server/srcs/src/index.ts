import fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import { db } from './db/db.ts';
import { users, chat } from './db/schema.ts';
import { eq, lt, gte, ne, or } from 'drizzle-orm';
import http from "http";
import { validateJWT } from './jwt';

const server = fastify({ logger: true })

const connections = new Map<WebSocket, number>();

interface ChatUser {
	id: number,
	name: string
}

function onlyUnique(value:ChatUser, index:number, array:ChatUser[]) {
	return index === array.findIndex((t) => (t.id === value.id));
}

function mapUser(value:ChatUser, index:number, array:ChatUser[]) {
	return value.name;
}

function newConn(sock: WebSocket, token: string) {
	let userInfos = validateJWT(token);
	if (!userInfos) {
		sock.close(1 , "Invalid token.");
		return 1;
	}
	// TODO: Check if jwt data is correct
	connections.set(sock, userInfos.id);
	return 0;
}

async function sendContacts(sock: WebSocket) {
	const userId = connections.get(sock);
	try {
		const authors:ChatUser[] = await db.selectDistinctOn([chat.author], {id: chat.author, name: users.username}).from(chat).where(eq(userId, chat.dest)).innerJoin(users, eq(chat.author, users.id));
		const dests:ChatUser[] = await db.selectDistinctOn([chat.dest], {id: chat.dest, name: users.username}).from(chat).where(eq(userId, chat.author)).innerJoin(users, eq(chat.dest, users.id));
		let res:string[] = authors.concat(dests).filter(onlyUnique).map(mapUser);
		sock.send(JSON.stringify(res));
	} catch (error) {
		console.log(error);
	}
}

async function broadcast(authorId: number | undefined, dest: number, packet: any, stamp: any) {
	const author = await db.select({name: users.username}).from(users).where(eq(users.id, authorId));
	connections.forEach((id, sock) => {
		if (id === authorId || id === dest)
			sock.send(JSON.stringify({type: "message", message: packet.message, author: author[0].name, dest: packet.dest, timestamp: stamp}));
	});
}

const start = async () => {
	try {
		server.register(fastifyWebsocket);
		server.register( async function (fastify) {
			server.get('/api/chat', { websocket: true }, async (socket: WebSocket, req: http.IncomingMessage) => {
				if (newConn(socket, req.query.token))
					return ;
				await sendContacts(socket);
				socket.on('close', () => {
					console.log("User "+connections.get(socket)+" disconnected.");
					connections.delete(socket);
				});
				socket.on('message', async (message: string) => {
					let packet = JSON.parse(message);
					switch (packet.type) {
						case "message":
							try {
								const targetId = await db.select().from(users).where(eq(users.username, packet.target));
								if (targetId.length === 0) {
									socket.send(JSON.stringify({error: "User does not exist."}));
									break ;
								}
								const stamp: any = await db.insert(chat).values({author: connections.get(socket), dest: targetId[0].id, content: packet.message}).returning({timestamp: chat.timestamp});
								await broadcast(connections.get(socket), targetId[0].id, packet, stamp[0].timestamp);
							} catch (error) {
								console.log(error);
							}
							break;

						case "history":
							try {
								const userId = await db.select({id: users.id}).from(users).where(eq(users.username, packet.target));
								if (userId.length === 0) {
									socket.send(JSON.stringify({error: "User does not exist."}));
									break ;
								}
								const history = await db.select().from(chat).where(or(eq(userId[0].id, chat.dest), eq(userId[0].id, chat.author))).orderBy(chat.timestamp);
								socket.send(JSON.stringify({type: "history", history}));
							} catch (error) {
								console.log(error);
							}
							break;

						default:
							break;
					}
				});
			})
		})
		await server.listen({ host: '0.0.0.0', port: 5786 });
	}
	catch (err) {
		server.log.error(err);
		process.exit(1);
	}
}

start();