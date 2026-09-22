import fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { db } from './db/db.ts';
import { users, chat } from './db/schema.ts';
import { eq, or, and } from 'drizzle-orm';
import { validateJWT } from './jwt.ts';

const server = fastify({ logger: true })

const connections = new Map<fastifyWebsocket.WebSocket, { id: number, isAlive: boolean }>();

interface ChatContact {
	id: number,
	name: string,
	avatar: string | null,
	message: string,
	time: Date,
	online: boolean
}

function onlyUnique(value:ChatContact, index:number, array:ChatContact[]) {
	return index === array.findLastIndex((t) => (t.id === value.id));
}

function timeSort(a: ChatContact, b: ChatContact): number {
	return a.time.getTime() - b.time.getTime();
}

async function newConn(sock: fastifyWebsocket.WebSocket, token: string): Promise<boolean> {
	let userInfos = await validateJWT(token);
	if (userInfos.empty === 0) {
		sock.close(3000 , "Invalid token.");
		return false;
	}
	let numLog = 0;
	connections.forEach((userId) => {
		if (userId.id === userInfos.id)
			numLog++;
	});
	if (numLog == 0) {
		await db.update(users).set({online_status: true}).where(eq(users.id, userInfos.id));
		connections.forEach((userId, sock) => {
			if (userId != userInfos.id)
				sock.send(JSON.stringify({type: "statusChange", valid:true, body:{id: userInfos.id, status: true}}));
		});
	}
	connections.set(sock, {id: userInfos.id, isAlive: true});
	return true;
}

async function sendContacts(sock: fastifyWebsocket.WebSocket) {
	let thisUser = connections.get(sock);
	if (!thisUser) return ;

	const userId = thisUser.id;
	try {
		const authors:ChatContact[] = await db.select({id: chat.author, name: users.username, avatar:users.icon, time: chat.timestamp, message: chat.content, online:users.online_status}).from(chat).where(eq(chat.dest, userId)).innerJoin(users, eq(chat.author, users.id));
		const dests:ChatContact[] = await db.select({id: chat.dest, name: users.username, avatar:users.icon, time: chat.timestamp, message: chat.content, online:users.online_status}).from(chat).where(eq(chat.author, userId)).innerJoin(users, eq(chat.dest, users.id));
		const body:ChatContact[] = authors.concat(dests).sort(timeSort).filter(onlyUnique);
		sock.send(JSON.stringify({type: "contacts", body}));
	} catch (error) {
		console.log(error);
	}
}

async function broadcast(authorId: number | undefined, dest: number, packet: any, stamp: any) {
	connections.forEach((userInfos, sock) => {
		if (userInfos.id === authorId || userInfos.id === dest)
			sock.send(JSON.stringify({type: "message", valid:true, body:{author: authorId, target: dest, message: packet.message, timestamp: stamp}}));
	});
}

server.register(fastifyWebsocket);
server.register(async function (server) {
	server.get('/api/chat', { websocket: true }, async (socket: fastifyWebsocket.WebSocket, req: any) => {
		let authRes:boolean = await newConn(socket, req.query.token);
		if (!authRes)
			return ;
		await sendContacts(socket);
		socket.on('close', async () => {
			let thisUser = connections.get(socket);
			if (!thisUser) return ;
			
			let numLog = 0;
			let thisId = thisUser.id;
			console.log("User "+thisId+" disconnected.");
			connections.forEach((userId) => {
				if (userId.id === thisId)
					numLog++;
			});
			if (numLog <= 1) {
				await db.update(users).set({online_status: false}).where(eq(users.id, thisId));
				connections.forEach((userId, sock) => {
					if (userId.id != thisId)
						sock.send(JSON.stringify({type: "statusChange", valid:true, body:{id: thisId, status: false}}));
				});
			}
			connections.delete(socket);
		});
		socket.on('message', async (message:any) => {
			let packet = JSON.parse(message);
			let thisUser = connections.get(socket);
			console.log(thisUser);
			if (!thisUser) return ;
			let thisId = thisUser.id;

			console.log(packet);
			switch (packet.type) {
				case "message":
					try {
						if (packet.message.length === 0) {
							socket.send(JSON.stringify({type: "message", valid:false, body:{cause: "Message is empty."}}));
							break ;
						}
						if (packet.target === thisId) {
							socket.send(JSON.stringify({type: "message", valid:false, body:{cause: "Cannot chat with yourself."}}));
							break ;
						}
						const targetId = await db.select({id: users.id}).from(users).where(eq(users.id, packet.target));
						if (targetId.length === 0) {
							socket.send(JSON.stringify({type: "message", valid:false, body:{cause: "User does not exist."}}));
							break ;
						}
						const stamp: any = await db.insert(chat).values({author: thisId, dest: packet.target, content: packet.message}).returning({timestamp: chat.timestamp});
						await broadcast(thisId, packet.target, packet, stamp[0].timestamp);
					} catch (error) {
						console.log(error);
					}
					break;

				case "history":
					try {
						const targetId = await db.select({id: users.id}).from(users).where(eq(users.id, packet.target));
						if (targetId.length === 0) {
							socket.send(JSON.stringify({type: "history", valid:false, body:{cause: "User does not exist."}}));
							break ;
						}
						const history = await db.select({author: chat.author, target: chat.dest, message: chat.content, timestamp: chat.timestamp}).from(chat).where(or(and(eq(packet.target, chat.dest), eq(chat.author, thisId)), and(eq(packet.target, chat.author), eq(chat.dest, thisId)))).orderBy(chat.timestamp);
						socket.send(JSON.stringify({type: "history", valid:true, body: {target: packet.target, history}}));
					} catch (error) {
						console.log(error);
					}
					break;

				case "newChat":
					try {
						const targetId = await db.select({id: users.id, name: users.username, avatar: users.icon, online:users.online_status}).from(users).where(eq(users.username, packet.target));
						if (targetId.length === 0)
							socket.send(JSON.stringify({type:"newChat", valid:false, body:{cause: "User does not exist.", index: packet.index}}));
						else if (targetId[0].id === thisId)
							socket.send(JSON.stringify({type:"newChat", valid:false, body:{cause: "Cannot chat with yourself.", index: packet.index}}));
						else
							socket.send(JSON.stringify({type:"newChat", valid:true, body:{id:targetId[0].id, name:targetId[0].name, avatar:targetId[0].avatar, online:targetId[0].online, index:packet.index}}));
					} catch (error) {
						console.log(error);
					}
					break;

				case "infos":
					if (packet.target === thisId) {
						socket.send(JSON.stringify({type: "infos", valid:false, body:{cause: "Target is sender."}}));
						break ;
					}
					try {
						const body = await db.select({id: users.id, name: users.username, avatar: users.icon, online:users.online_status}).from(users).where(eq(users.id, packet.target));
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
					connections.forEach((userId, sock) => {
						if (userId.id != thisId)
							sock.send(JSON.stringify({type: "profileChange", valid:true, body:{id: thisUser, name: packet.name, avatar: packet.avatar}}));
					});
					break;

				default:
					break;
			}
		});
		socket.on('pong', () => {
			let thisUser = connections.get(socket);
			if (thisUser)
				thisUser.isAlive = true;
		});
	});

	setInterval(async () => {
		for (const [socket, state] of connections) {
			if (!state.isAlive) {
				let numLog = 0;
				console.log("User "+state.id+"'s connection is dead, disconnecting.");
				connections.forEach((userId) => {
					if (userId.id === state.id)
						numLog++;
				});
				if (numLog <= 1) {
					await db.update(users).set({online_status: false}).where(eq(users.id, state.id));
					connections.forEach((userId, sock) => {
						if (userId.id != state.id)
							sock.send(JSON.stringify({type: "statusChange", valid:true, body:{id: state.id, status: false}}));
					});
				}
				socket.terminate();
				connections.delete(socket);
				continue;
			}

			state.isAlive = false;
			socket.ping();
		}
	}, 30000);
});

server.listen({ host: '0.0.0.0', port: 5786 }, err => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
});
