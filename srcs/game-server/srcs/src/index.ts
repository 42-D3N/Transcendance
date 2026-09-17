import Fastify from 'fastify';
import fastifyWebsocket from '@fastify/websocket';
import { GameInstanceManager } from './game-instance-manager';
import type { ClientMessage } from '../../../website/srcs/src/lib/game/both/interfaces';
import type { AIDifficulty, MatchMode } from './pongVariables';

const server = Fastify({logger: true});
const gameInstances = new GameInstanceManager();

function parseMode(value: unknown): MatchMode
{
  return (value === 'pve' ? 'pve' : 'pvp');
}

function parseAIDifficulty(value: unknown): AIDifficulty | undefined
{
  if (value === 'easy' || value === 'normal' || value === 'hard' || value === 'impossible')
    return (value);
  return (undefined);
}

const start = async () => {
  server.register(fastifyWebsocket);
  server.register(async function (fastify: any)
  {
    server.get('/api/game_server', { websocket:true }, (socket: any, req: any) => {
      console.log("Client connecté");
      const mode = parseMode(req.query?.mode);
      const aiDifficulty = parseAIDifficulty(req.query?.aiDifficulty);
      const instanceIdParam = typeof req.query?.instanceId === 'string' ? req.query.instanceId : undefined;
      const userIdParam = typeof req.query?.userId === 'string' ? req.query.userId : undefined;
      const userParam = typeof req.query?.user === 'string' ? req.query.user : undefined;
      let parsedUser: any = undefined;
      if (userParam)
      {
        try         { parsedUser = JSON.parse(userParam); }
        catch (err) { console.warn('Invalid user payload in websocket query', err); }
      }
      const joinResult = gameInstances.join(socket, {
        mode,
        aiDifficulty,
        instanceId: instanceIdParam,
        userId: userIdParam,
        user: parsedUser
      });
      const side = joinResult.side;

      if (side !== null)
      {
        const opponentUser = side === 1
          ? gameInstances.getOpponentUsername(joinResult.instanceId, 1)
          : gameInstances.getOpponentUsername(joinResult.instanceId, 2);

        socket.send(JSON.stringify({
          type: 'playerAssigned',
          side,
          instanceId: joinResult.instanceId,
          opponentUsername: opponentUser ?? null
        }));
      }

      socket.on("message", async (data: any) =>
      {
        const message = JSON.parse(data.toString()) as ClientMessage;
        switch (message.type)
        {
          case "ping":
            socket.send(JSON.stringify({ type: "pong" }));
            break;
          case "input":
            gameInstances.storeInputs(joinResult.instanceId, socket, message);
            break;
          case "ready":
            gameInstances.setReady(joinResult.instanceId, socket);
            break;
        }
      });
      socket.on("close", () => {
        console.log("Client déconnecté");
        gameInstances.leave(joinResult.instanceId, socket);
      });
    })
  })
  try { await server.listen({ port: 3310, host: '0.0.0.0' }); }
  catch (err)
  {
    server.log.error(err);
    process.exit(1);
  }
};

start();
