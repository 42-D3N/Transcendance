import { serverVariable } from './pongVariables';
import type { ClientInputMessage, ConnectedPlayer, ClientGameState, Player } from '../../../website/srcs/src/lib/game/both/interfaces';

type Game = ReturnType<typeof serverVariable>;

const vars = serverVariable();
const clients = new Set<WebSocket>();
const connectedPlayers: ConnectedPlayer[] = [];

export function addClient(socket: WebSocket)
{
  clients.add(socket);
}

export function removeClient(socket: WebSocket)
{
  clients.delete(socket);
}

export function storeInputs(socket: WebSocket, message: ClientInputMessage)
{
  vars.player1.input = message.input;
  socket.send(JSON.stringify(vars.player1));
}

function buildClientGameState(vars: Game): ClientGameState
{
  return {
    status: vars.state.status,
    score: vars.state.score,
    ball: vars.ball.pos,
    player1: { racket: vars.player1.racket.pos },
    player2: { racket: vars.player2.racket.pos }
  };
}

function updateRackets(player: Player, vars: Game)
{
  const min = 0;
  const max = vars.GAME_WIDTH - player.racket.size.w;

  player.racket.vel.x = player.input.move * vars.rules.racketSpeed;
  player.racket.pos.x += player.racket.vel.x * vars.DT;
  if (player.racket.pos.x < min)
    player.racket.pos.x = min;
  if (player.racket.pos.x > max)
    player.racket.pos.x = max;
}

function updatePlayers(vars: Game)
{
  updateRackets(vars.player1, vars);
  updateRackets(vars.player2, vars);
}

function broadcast(message: unknown)
{
  const packet = JSON.stringify(message);
  for (const cli of clients)
  {
    if (cli.readyState === WebSocket.OPEN)
      cli.send(packet);
  }
}

function gameTick(vars: Game)
{
  vars.state.tick++;
  vars.state.elapsedTime += vars.DT;
  if (vars.state.tick % 60 === 0)
    console.log("time :", vars.state.tick/60, "sec");

  updatePlayers(vars);
  // updateBall(vars);

  broadcast({type: "gameState", state: buildClientGameState(vars) });
}

export function gameLoop()
{
  setInterval(() =>
  {
    gameTick(vars);
  }, vars.TICK_INTERVAL);
}
