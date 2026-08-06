import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { gameLoop, storeInputs, addClient, removeClient } from './game';
import type { ClientMessage } from '../../../website/srcs/src/lib/game/both/interfaces';

const server = Fastify({logger: true});

const start = async () => {
  server.register(fastifyWebsocket);
  server.register(async function (fastify: any)
  {
    server.get('/', { websocket:true }, (socket: any, req: any) => {
      console.log("Client connecté");
      addClient(socket);
      socket.on("message", async (data: any) =>
      {
        const message = JSON.parse(data.toString()) as ClientMessage;
        switch (message.type)
        {
          case "ping":
            socket.send(JSON.stringify({ type: "pong" }));
            break;
          case "input":
            storeInputs(socket, message);
            break;
        }
        console.log(message);
      });
      socket.on("close", () => { console.log("Client déconnecté"); removeClient(socket); });
    })
  })
  try { await server.listen({ port: 3310, host: '0.0.0.0' }); }
  catch (err)
  {
    server.log.error(err);
    process.exit(1);
  }
  gameLoop();
};

start();
