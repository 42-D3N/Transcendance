import fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import { db } from './db/db.ts';
import { users, chat } from './db/schema.ts';
import { eq, lt, gte, ne, or, and } from 'drizzle-orm';
import http from "http";
import { validateJWT } from './jwt';

const server = fastify({ logger: true })

const connections = new Map<WebSocket, number>();

interface ChatContact {
	id: number,
	name: string,
	avatar: string,
	message: string,
	time: Date
}

function onlyUnique(value:ChatContact, index:number, array:ChatContact[]) {
	return index === array.findLastIndex((t) => (t.id === value.id));
}

function timeSort(a: ChatContact, b: ChatContact): number {
	return a.time.getTime() - b.time.getTime();
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
		const authors:ChatContact[] = await db.select({id: chat.author, name: users.username, avatar:users.icon, time: chat.timestamp, message: chat.content}).from(chat).where(eq(userId, chat.dest)).innerJoin(users, eq(chat.author, users.id));
		const dests:ChatContact[] = await db.select({id: chat.dest, name: users.username, avatar:users.icon, time: chat.timestamp, message: chat.content}).from(chat).where(eq(userId, chat.author)).innerJoin(users, eq(chat.dest, users.id));
		const body:ChatContact[] = authors.concat(dests).sort(timeSort).filter(onlyUnique);
		sock.send(JSON.stringify({type: "contacts", body}));
	} catch (error) {
		console.log(error);
	}
}

async function broadcast(authorId: number | undefined, dest: number, packet: any, stamp: any) {
	connections.forEach((userId, sock) => {
		if (userId === authorId || userId === dest)
			sock.send(JSON.stringify({type: "message", valid:true, body:{author: authorId, target: dest, message: packet.message, timestamp: stamp}}));
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
					console.log(packet);
					switch (packet.type) {
						case "message":
							try {
								if (packet.message.length === 0) {
									socket.send(JSON.stringify({type: "message", valid:false, body:{cause: "Message is empty."}}));
									break ;
								}
								if (packet.target === connections.get(socket)) {
									socket.send(JSON.stringify({type: "message", valid:false, body:{cause: "Cannot chat with yourself."}}));
									break ;
								}
								const targetId = await db.select({id: users.id}).from(users).where(eq(users.id, packet.target));
								if (targetId.length === 0) {
									socket.send(JSON.stringify({type: "message", valid:false, body:{cause: "User does not exist."}}));
									break ;
								}
								const stamp: any = await db.insert(chat).values({author: connections.get(socket), dest: packet.target, content: packet.message}).returning({timestamp: chat.timestamp});
								await broadcast(connections.get(socket), packet.target, packet, stamp[0].timestamp);
							} catch (error) {
								console.log(error);
							}
							break;

						case "history":
							try {
								const targetId = await db.select({id: users.id}).from(users).where(eq(users.id, packet.target));
								const authId = connections.get(socket);
								if (targetId.length === 0) {
									socket.send(JSON.stringify({type: "history", valid:false, body:{cause: "User does not exist."}}));
									break ;
								}
								const history = await db.select({author: chat.author, target: chat.dest, message: chat.content, timestamp: chat.timestamp}).from(chat).where(or(and(eq(packet.target, chat.dest), eq(authId, chat.author)), and(eq(packet.target, chat.author), eq(authId, chat.dest)))).orderBy(chat.timestamp);
								socket.send(JSON.stringify({type: "history", valid:true, body: {target: packet.target, history}}));
							} catch (error) {
								console.log(error);
							}
							break;

						case "newChat":
							try {
								const targetId = await db.select({id: users.id, name: users.username, avatar: users.icon}).from(users).where(eq(users.username, packet.target));
								if (targetId.length === 0)
									socket.send(JSON.stringify({type:"newChat", valid:false, body:{cause: "User does not exist.", index: packet.index}}));
								else if (targetId[0].id === connections.get(socket))
									socket.send(JSON.stringify({type:"newChat", valid:false, body:{cause: "Cannot chat with yourself.", index: packet.index}}));
								else
									socket.send(JSON.stringify({type:"newChat", valid:true, body:{id:targetId[0].id, name:targetId[0].name, avatar:targetId[0].avatar, index:packet.index}}));
							} catch (error) {
								console.log(error);
							}
							break;

						case "infos":
							if (packet.target == connections.get(socket)) {
								socket.send(JSON.stringify({type: "infos", valid:false, body:{cause: "Target is sender."}}));
								break ;
							}
							try {
								const body = await db.select({id: users.id, name: users.username, avatar: users.icon}).from(users).where(eq(users.id, packet.target));
								if (body.length === 0) {
									socket.send(JSON.stringify({type: "infos", valid:false, body:{cause: "User does not exist."}}));
									break ;
								}
								socket.send(JSON.stringify({type: "infos", valid:true, body:body[0]}));
							} catch (error) {
								console.log(error);
							}
							break;

						case "profileChange":
							const thisUser = connections.get(socket);
							connections.forEach((userId, sock) => {
								if (userId != thisUser)
									sock.send(JSON.stringify({type: "profileChange", valid:true, body:{id: thisUser, name: packet.name, avatar: packet.avatar}}));
							});
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