import fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'
import { db } from './db/db.ts';
import { users, chat } from './db/schema.ts';
import { eq, lt, gte, ne } from 'drizzle-orm';
import http from "http";
import { validateJWT } from './jwt';

const server = fastify({ logger: true })

const connections = new Map<WebSocket, string>();

function newConn(sock: WebSocket, token: string) {
	let userInfos = validateJWT(token);
	if (!userInfos) {
		sock.close(1 , "Invalid token.");
		return 1;
	}
	connections.set(sock, userInfos.id);
	return 0;
}

async function sendContacts(sock: WebSocket) {
	const userId = connections.get(sock);
	try {
		const authors = await db.selectDistinct({id: chat.author}).from(chat).where(eq(userId, chat.dest));
		const dests = await db.selectDistinct({id: chat.dest}).from(chat).where(eq(userId, chat.author));
		console.log(authors);
		console.log(dests);
	} catch (error) {
		console.log(error);
	}
}

const start = async () => {
	try {
		server.register(fastifyWebsocket);
		server.register( async function (fastify) {
			server.get('/api/chat', { websocket: true }, (socket: WebSocket, req: http.IncomingMessage) => {
				if (newConn(socket, req.query.token))
					return ;
				sendContacts(socket);
				socket.on('message', async (message: string) => {
					if (message.toString() === 'hi from client')
						socket.send('hi from server');
				})
				return { hello: 'world' };
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