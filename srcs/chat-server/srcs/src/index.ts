import fastify from 'fastify'
import fastifyWebsocket from '@fastify/websocket'

const server = fastify({ logger: true })

const start = async () => {
	try {
		server.register(fastifyWebsocket);
		server.register( async function (fastify) {
			server.get('/', { websocket: true }, (socket, req) => {
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