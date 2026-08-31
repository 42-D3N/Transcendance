import { serverVariable } from './pongVariables';
import type { ClientInputMessage, ConnectedPlayer, ClientGameState, Player } from '../../../website/srcs/src/lib/game/both/interfaces';

type Game = ReturnType<typeof serverVariable>;

const vars = serverVariable();
const clients = new Set<WebSocket>();
const connectedPlayers: ConnectedPlayer[] = [];

export function addClient(socket: WebSocket)
{
  if (connectedPlayers.length >= 2)
  {
    socket.close(1013, "Game is full");
    return;
  }
  clients.add(socket);
  const player = connectedPlayers.length === 0 ? vars.player1 : vars.player2;
  connectedPlayers.push({ socket, player });
  if (connectedPlayers.length === 1)
    resetBall(vars, 1);
  vars.state.status = "playing";
}

export function removeClient(socket: WebSocket)
{
  clients.delete(socket);
  const playerIndex = connectedPlayers.findIndex(client => client.socket === socket);
  if (playerIndex !== -1)
  {
    connectedPlayers[playerIndex].player.input = { move: 0, special: false };
    connectedPlayers.splice(playerIndex, 1);
  }
  if (connectedPlayers.length === 0)
    vars.state.status = "waiting";
}

export function storeInputs(socket: WebSocket, message: ClientInputMessage)
{
  const client = connectedPlayers.find(player => player.socket === socket);
  if (client)
    client.player.input = message.input;
}

function buildClientGameState(vars: Game): ClientGameState
{
  const prediction = vars.state.status === "round_end" ? predictLanding(vars) : null;
  return {
    status: vars.state.status,
    score: vars.state.score,
    ball: vars.ball.pos,
    prediction,
    player1: { racket: vars.player1.racket.pos },
    player2: { racket: vars.player2.racket.pos }
  };
}

function predictLanding(vars: Game)
{
  const distance = 140;
  const speed = Math.max(Math.hypot(vars.ball.vel.x, vars.ball.vel.y), 1);
  let remaining = distance;
  let x = vars.ball.pos.x + vars.ball.size.w / 2;
  let y = vars.ball.pos.y + vars.ball.size.h / 2;
  let velocityX = vars.ball.vel.x / speed;
  const velocityY = vars.ball.vel.y / speed;
  const minX = vars.ball.size.w / 2;
  const maxX = vars.GAME_WIDTH - vars.ball.size.w / 2;

  while (remaining > 0)
  {
    const wallDistance = velocityX > 0 ? maxX - x : x - minX;
    const distanceToWall = Math.abs(wallDistance / velocityX);
    const segment = Math.min(remaining, Number.isFinite(distanceToWall) ? distanceToWall : remaining);
    x += velocityX * segment;
    y += velocityY * segment;
    remaining -= segment;
    if (segment === distanceToWall && remaining > 0)
      velocityX *= -1;
  }

  return {
    start: { x: vars.ball.pos.x + vars.ball.size.w / 2, y: vars.ball.pos.y + vars.ball.size.h / 2 },
    end: { x, y }
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

function updateAI(vars: Game)
{
  if (connectedPlayers.some(client => client.player === vars.player2))
    return;

  const racketCenter = vars.player2.racket.pos.x + vars.player2.racket.size.w / 2;
  const ballCenter = vars.ball.pos.x + vars.ball.size.w / 2;
  vars.player2.input.move = ballCenter < racketCenter - 5 ? -1 : ballCenter > racketCenter + 5 ? 1 : 0;
}

function overlapsRacket(player: Player, vars: Game)
{
  const ball = vars.ball;
  const racket = player.racket;
  return ball.pos.x < racket.pos.x + racket.size.w
    && ball.pos.x + ball.size.w > racket.pos.x
    && ball.pos.y < racket.pos.y + racket.size.h
    && ball.pos.y + ball.size.h > racket.pos.y;
}

function bounceOnRacket(player: Player, vars: Game, verticalDirection: 1 | -1)
{
  const ball = vars.ball;
  const racket = player.racket;
  const racketCenter = racket.pos.x + racket.size.w / 2;
  const ballCenter = ball.pos.x + ball.size.w / 2;
  const impact = Math.max(-1, Math.min(1,
    (ballCenter - racketCenter) / (racket.size.w / 2)
  ));
  const maxAngle = Math.PI / 3;
  const angle = impact * maxAngle;
  const speed = Math.min(
    Math.max(ball.speed, vars.rules.baseSpeed),
    vars.rules.maxSpeed
  );

  ball.vel.x = Math.sin(angle) * speed;
  ball.vel.y = verticalDirection * Math.cos(angle) * speed;
}

function resetBall(vars: Game, direction: 1 | -1)
{
  vars.ball.pos.x = vars.BALL_BASE_POSITION.x;
  vars.ball.pos.y = vars.BALL_BASE_POSITION.y;
  vars.ball.speed = vars.rules.baseSpeed;
  const angle = (Math.random() * 2 - 1) * (70 * Math.PI / 180);
  vars.ball.vel.x = Math.sin(angle) * vars.ball.speed;
  vars.ball.vel.y = Math.cos(angle) * vars.ball.speed * direction;
}

export function updateBall(vars: Game)
{
//   console.log(vars.ball.vel.x * vars.DT)
  vars.ball.pos.x += vars.ball.vel.x * vars.DT;
  vars.ball.pos.y += vars.ball.vel.y * vars.DT;

  if (vars.ball.pos.x <= 0)
  {
    vars.ball.pos.x = 0;
    vars.ball.vel.x *= -1;
  }
  if (vars.ball.pos.x + vars.ball.size.w >= vars.GAME_WIDTH)
  {
    vars.ball.pos.x = vars.GAME_WIDTH - vars.ball.size.w;
    vars.ball.vel.x *= -1;
  }

  if (vars.ball.vel.y > 0 && overlapsRacket(vars.player1, vars))
  {
    vars.ball.pos.y = vars.player1.racket.pos.y - vars.ball.size.h;
    bounceOnRacket(vars.player1, vars, -1);
  }
  if (vars.ball.vel.y < 0 && overlapsRacket(vars.player2, vars))
  {
    vars.ball.pos.y = vars.player2.racket.pos.y + vars.player2.racket.size.h;
    bounceOnRacket(vars.player2, vars, 1);
  }

  if (vars.ball.pos.y + vars.ball.size.h < 0)
  {
    vars.state.score.p1++;
    vars.state.lastWinner = 1;
    resetBall(vars, 1);
    vars.roundEndTick = vars.state.tick + vars.ROUND_PAUSE_TICKS;
  }
  else if (vars.ball.pos.y > vars.GAME_HEIGHT)
  {
    vars.state.score.p2++;
    vars.state.lastWinner = 2;
    resetBall(vars, -1);
    vars.roundEndTick = vars.state.tick + vars.ROUND_PAUSE_TICKS;
  }

  if (vars.state.score.p1 >= vars.rules.scoreToWin || vars.state.score.p2 >= vars.rules.scoreToWin)
    vars.state.status = "game_end";
  else if (vars.roundEndTick > vars.state.tick)
    vars.state.status = "round_end";

  vars.ball.speed = Math.min(
    vars.ball.speed + vars.rules.acceleration * vars.DT,
    vars.rules.maxSpeed
  );
}

export function updatePlayers(vars: Game)
{
  updateAI(vars);
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
    console.log("time :", vars.state.tick / 60, "sec | Ball velX :", vars.ball.vel.x, "Ball velY :", vars.ball.vel.y);

  if (vars.state.status === "round_end")
  {
    if (vars.state.tick >= vars.roundEndTick)
      vars.state.status = "playing";
  }
  else if (vars.state.status === "playing")
  {
    updatePlayers(vars);
    updateBall(vars);
  }
  broadcast({type: "gameState", state: buildClientGameState(vars) });
}

export function gameLoop()
{
  setInterval(() => { gameTick(vars); }, vars.TICK_INTERVAL);
}
