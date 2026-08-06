import Fastify from 'fastify'

const fastify = Fastify({logger: true});

fastify.get('/', function (request:any, reply:any) {
	reply.send({ hello: 'world'})
});

const start = async () => {
	try { await fastify.listen({ port: 3310, host: '0.0.0.0' }); }
	catch (err)
	{
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
