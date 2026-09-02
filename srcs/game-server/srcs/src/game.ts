import { serverVariable } from './pongVariables';
import type { ClientInputMessage, ConnectedPlayer, ClientGameState, Player } from '../../../website/srcs/src/lib/game/both/interfaces';

type Game = ReturnType<typeof serverVariable>;
type PlayerSide = 1 | 2;

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
  const prediction = vars.state.status === "round_end"
    ? predictLanding(vars)
    : vars.state.status === "power_pause" ? predictPoweredTrajectory(vars) : null;
  return {
    status: vars.state.status,
    score: vars.state.score,
    ball: vars.ball.pos,
    prediction,
    player1: { racket: vars.player1.racket.pos },
    player2: { racket: vars.player2.racket.pos }
  };
}

function getBallCenter(vars: Game)
{
  return {
    x: vars.ball.pos.x + vars.ball.size.w / 2,
    y: vars.ball.pos.y + vars.ball.size.h / 2
  };
}

function predictLanding(vars: Game)
{
  const distance = 140;
  const speed = Math.max(Math.hypot(vars.ball.vel.x, vars.ball.vel.y), 1);
  let remaining = distance;
  const start = getBallCenter(vars);
  let x = start.x;
  let y = start.y;
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
    start,
    end: { x, y }
  };
}

function predictPoweredTrajectory(vars: Game)
{
  if (vars.power.boostedTarget === null)
    return (null);

  const speed = Math.max(Math.hypot(vars.ball.vel.x, vars.ball.vel.y), 1);
  const start = getBallCenter(vars);
  let x = start.x;
  let y = start.y;
  let velocityX = vars.ball.vel.x / speed;
  const velocityY = vars.ball.vel.y / speed;
  const minX = vars.ball.size.w / 2;
  const maxX = vars.GAME_WIDTH - vars.ball.size.w / 2;
  const targetY = vars.power.boostedTarget === 1
    ? vars.player1.racket.pos.y - vars.ball.size.h / 2
    : vars.player2.racket.pos.y + vars.player2.racket.size.h + vars.ball.size.h / 2;

  if (velocityY === 0)
    return { start, end: start };

  for (let guard = 0; guard < 16; guard++)
  {
    const distanceToTarget = (targetY - y) / velocityY;
    const distanceToWall = velocityX === 0
      ? Number.POSITIVE_INFINITY
      : Math.abs(((velocityX > 0 ? maxX : minX) - x) / velocityX);

    if (distanceToTarget <= distanceToWall)
      return {
        start,
        end: { x: x + velocityX * distanceToTarget, y: targetY }
      };

    x += velocityX * distanceToWall;
    y += velocityY * distanceToWall;
    velocityX *= -1;
  }

  return { start, end: { x, y } };
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

function getRemainingPowerUses(side: PlayerSide, vars: Game)
{
  return (side === 1 ? vars.power.remainingUses.p1 : vars.power.remainingUses.p2);
}

function consumePowerUse(side: PlayerSide, vars: Game)
{
  if (side === 1)
    vars.power.remainingUses.p1--;
  else
    vars.power.remainingUses.p2--;
}

function isBallMovingTowardOpponent(side: PlayerSide, vars: Game)
{
  return (side === 1 ? vars.ball.vel.y < 0 : vars.ball.vel.y > 0);
}

function isBallOnOwnerHalf(side: PlayerSide, vars: Game)
{
  const { y } = getBallCenter(vars);
  return (side === 1 ? y > vars.POWER_TRIGGER_LINE_Y : y < vars.POWER_TRIGGER_LINE_Y);
}

function armPowerIfPossible(side: PlayerSide, vars: Game)
{
  if (vars.state.status !== "playing"
    || vars.power.pendingOwner !== null
    || vars.power.boostedTarget !== null
    || getRemainingPowerUses(side, vars) <= 0
    || !isBallMovingTowardOpponent(side, vars)
    || !isBallOnOwnerHalf(side, vars))
    return;

  consumePowerUse(side, vars);
  vars.power.pendingOwner = side;
}

function updatePowerInputs(vars: Game)
{
  const players = [
    { side: 1 as const, input: vars.player1.input, latched: vars.power.specialLatch.p1 },
    { side: 2 as const, input: vars.player2.input, latched: vars.power.specialLatch.p2 }
  ];

  for (const player of players)
  {
    if (player.input.special && !player.latched)
      armPowerIfPossible(player.side, vars);

    if (player.side === 1)
      vars.power.specialLatch.p1 = player.input.special;
    else
      vars.power.specialLatch.p2 = player.input.special;
  }

  if (vars.power.pendingOwner !== null && !isBallMovingTowardOpponent(vars.power.pendingOwner, vars))
    vars.power.pendingOwner = null;
}

function applyPoweredDirectionShift(vars: Game)
{
  const previousVerticalDirection = Math.sign(vars.ball.vel.y) || 1;
  const boostedSpeed = vars.ball.speed;
  const horizontalOffset = boostedSpeed * vars.POWER_DIRECTION_VARIATION * (Math.random() < 0.5 ? -1 : 1);
  const maxHorizontalSpeed = boostedSpeed * 0.85;
  const nextX = Math.max(
    -maxHorizontalSpeed,
    Math.min(maxHorizontalSpeed, vars.ball.vel.x + horizontalOffset)
  );
  const nextY = previousVerticalDirection * Math.sqrt(boostedSpeed * boostedSpeed - nextX * nextX);

  vars.ball.vel.x = nextX;
  vars.ball.vel.y = nextY;
}

function triggerPowerPause(owner: PlayerSide, vars: Game)
{
  vars.power.pendingOwner = null;
  vars.power.pauseUntilTick = vars.state.tick + vars.POWER_PAUSE_TICKS;
  vars.power.boostedTarget = owner === 1 ? 2 : 1;
  vars.power.baseSpeedBeforeBoost = vars.ball.speed;
  vars.ball.speed *= vars.POWER_SPEED_MULTIPLIER;
  applyPoweredDirectionShift(vars);
  vars.state.status = "power_pause";
}

function maybeTriggerPowerAtMidline(previousCenterY: number, vars: Game)
{
  if (vars.power.pendingOwner === null)
    return false;

  const currentCenterY = getBallCenter(vars).y;
  const crossedMidline = vars.power.pendingOwner === 1
    ? previousCenterY > vars.POWER_TRIGGER_LINE_Y && currentCenterY <= vars.POWER_TRIGGER_LINE_Y
    : previousCenterY < vars.POWER_TRIGGER_LINE_Y && currentCenterY >= vars.POWER_TRIGGER_LINE_Y;

  if (!crossedMidline)
    return (false);

  triggerPowerPause(vars.power.pendingOwner, vars);
  return (true);
}

function clearPowerState(vars: Game)
{
  vars.power.pendingOwner = null;
  vars.power.pauseUntilTick = 0;
  vars.power.boostedTarget = null;
  vars.power.baseSpeedBeforeBoost = null;
}

function finishPoweredShot(vars: Game)
{
  if (vars.power.boostedTarget === null)
    return;

  vars.ball.speed = Math.min(
    Math.max(vars.power.baseSpeedBeforeBoost ?? vars.rules.baseSpeed, vars.rules.baseSpeed),
    vars.rules.maxSpeed
  );
  vars.power.boostedTarget = null;
  vars.power.baseSpeedBeforeBoost = null;
}

function overlapsRacket(player: Player, vars: Game)
{
  const ball = vars.ball;
  const racket = player.racket;
  return (
    ball.pos.x < racket.pos.x + racket.size.w
    && ball.pos.x + ball.size.w > racket.pos.x
    && ball.pos.y < racket.pos.y + racket.size.h
    && ball.pos.y + ball.size.h > racket.pos.y
  );
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
  ball.speed = Math.min(
    Math.max(ball.speed, vars.rules.baseSpeed) + vars.rules.acceleration,
    vars.power.boostedTarget === null ? vars.rules.maxSpeed : ball.speed
  );
  const speed = ball.speed;

  ball.vel.x = Math.sin(angle) * speed;
  ball.vel.y = verticalDirection * Math.cos(angle) * speed;
}

function resetBall(vars: Game, direction: 1 | -1)
{
  clearPowerState(vars);
  vars.ball.pos.x = vars.BALL_BASE_POSITION.x;
  vars.ball.pos.y = vars.BALL_BASE_POSITION.y;
  vars.ball.speed = vars.rules.baseSpeed;
  const angle = (Math.random() * 2 - 1) * (70 * Math.PI / 180);
  vars.ball.vel.x = Math.sin(angle) * vars.ball.speed;
  vars.ball.vel.y = Math.cos(angle) * vars.ball.speed * direction;
}

export function updateBall(vars: Game)
{
  const previousCenterY = getBallCenter(vars).y;
  vars.ball.pos.x += vars.ball.vel.x * vars.DT;
  vars.ball.pos.y += vars.ball.vel.y * vars.DT;

  if (maybeTriggerPowerAtMidline(previousCenterY, vars))
    return;

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
    if (vars.power.boostedTarget === 1)
      finishPoweredShot(vars);
    bounceOnRacket(vars.player1, vars, -1);
  }
  if (vars.ball.vel.y < 0 && overlapsRacket(vars.player2, vars))
  {
    vars.ball.pos.y = vars.player2.racket.pos.y + vars.player2.racket.size.h;
    if (vars.power.boostedTarget === 2)
      finishPoweredShot(vars);
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

  if (vars.power.boostedTarget === null)
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
  updatePowerInputs(vars);

  if (vars.state.status === "round_end")
  {
    if (vars.state.tick >= vars.roundEndTick)
      vars.state.status = "playing";
  }
  else if (vars.state.status === "power_pause")
  {
    updatePlayers(vars);
    if (vars.state.tick >= vars.power.pauseUntilTick)
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

/*
const expected = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
const result = won ? 1 : 0;
return ( Math.round(20 * (result - expected)) );
*/
