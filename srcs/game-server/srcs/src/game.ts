import { serverVariable } from './pongVariables.ts';
import { eq, lt, gte, ne, and } from 'drizzle-orm';
import { db } from './db/db.ts';
import { users, matches} from './db/schema.ts';

import type { ClientInputMessage, ConnectedPlayer, ClientGameState, Player } from './interfaces.ts';
import type { AIDifficulty, MatchConfig, MatchMode } from './pongVariables.ts';

type Game = ReturnType<typeof serverVariable>;
export type PlayerSide = 1 | 2;

export interface GameUserData
{
  id: number | string;
  username: string;
  wins: number;
  losses: number;
  matches: number;
  wallet: number;
  icon?: string | null;
  skin_rac?: number | string | null;
  skin_ball?: number | string | null;
}

export interface GameSessionConfig
{
  mode: MatchMode;
  aiDifficulty?: AIDifficulty;
}

export interface GameSession
{
  id: string;
  config: GameSessionConfig;
  start: () => void;
  stop: () => void;
  addClient: (socket: WebSocket, userId?: string, user?: GameUserData) => PlayerSide | null;
  removeClient: (socket: WebSocket) => void;
  storeInputs: (socket: WebSocket, message: ClientInputMessage) => void;
  setPlayerReady: (socket: WebSocket) => void;
  getOpponentUsername: (side: PlayerSide) => string | null;
  getOpponentSkinRac: (side: PlayerSide) => number | string | null;
  playerCount: () => number;
  isFull: () => boolean;
}

function getPlayerSide(vars: Game, player: Player): PlayerSide
{
  return (player === vars.player1 ? 1 : 2);
}

function resetPlayers(vars: Game)
{
  vars.player1.input = { move: 0 };
  vars.player2.input = { move: 0 };
  vars.player1.racket.pos.x = vars.GAME_WIDTH / 2;
  vars.player2.racket.pos.x = vars.GAME_WIDTH / 2;
  vars.player1.racket.vel.x = 0;
  vars.player2.racket.vel.x = 0;
  if (vars.player2.ai)
  {
    vars.player2.ai.lastDecisionTime = 0;
    vars.player2.ai.targetX = null;
  }
}

function startMatch(vars: Game)
{
  vars.state.score = { p1: 0, p2: 0 };
  vars.state.elapsedTime = 0;
  vars.roundEndTick = 0;
  resetPlayers(vars);
  resetBall(vars, Math.random() < 0.5 ? 1 : -1);
  vars.countdownLaunchVelocity = { x: vars.ball.vel.x, y: vars.ball.vel.y };
  vars.ball.vel.x = 0;
  vars.ball.vel.y = 0;
  vars.countdownEndTick = vars.state.tick + vars.MATCH_START_COUNTDOWN_TICKS;
  vars.state.status = 'countdown';
}

function maybeStartMatch(vars: Game, connectedPlayers: ConnectedPlayer[])
{
  if (vars.waitingForReconnect)
    return;

  if (vars.ready.p1 && vars.ready.p2)
    startMatch(vars);
  else if (connectedPlayers.length > 0)
    vars.state.status = 'ready_check';
  else
    vars.state.status = 'waiting';
}

function buildClientGameState(vars: Game): ClientGameState
{
  const prediction = vars.state.status === 'round_end'
    ? predictLanding(vars)
    : null;
  const countdown = vars.state.status === 'countdown'
    ? Math.max(1, Math.min(3, Math.ceil((vars.countdownEndTick - vars.state.tick) / vars.TICK_RATE)))
    : vars.state.status === 'round_end'
      ? Math.max(1, Math.min(3, Math.ceil((vars.roundEndTick - vars.state.tick + 1) / vars.TICK_RATE)))
      : null;

  return {
    status: vars.state.status,
    score: vars.state.score,
    ready: vars.ready,
    countdown,
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

function updateAI(vars: Game, connectedPlayers: ConnectedPlayer[])
{
  if (vars.mode !== 'pve' || connectedPlayers.some(client => client.player === vars.player2) || vars.player2WasHuman)
    return;

  const ai = vars.player2.ai;
  if (!ai)
    return;

  const reactionTicks = Math.max(1, Math.ceil(ai.level.reactionTime / vars.TICK_INTERVAL));
  const racketCenter = vars.player2.racket.pos.x + vars.player2.racket.size.w / 2;

  if (ai.targetX !== null)
  {
    if (Math.abs(ai.targetX - racketCenter) <= 5)
    {
      ai.targetX = null;
      vars.player2.input.move = 0;
    }
    else if (ai.targetX < racketCenter)
      vars.player2.input.move = -1;
    else
      vars.player2.input.move = 1;

    return;
  }

  if (vars.state.tick - ai.lastDecisionTime < reactionTicks)
  {
    vars.player2.input.move = 0;
    return;
  }

  let targetX;
  if (vars.ball.vel.y < 0)
  {
    const timeToReach = (vars.player2.racket.pos.y - vars.ball.pos.y) / vars.ball.vel.y;
    targetX = vars.ball.pos.x + vars.ball.vel.x * timeToReach;

    targetX += ((Math.random() - 0.2) * ai.level.errorMargin) / 2;
    while (targetX < 0 || targetX > vars.GAME_WIDTH)
    {
      if (targetX < 0)
        targetX = -targetX;
      if (targetX > vars.GAME_WIDTH)
        targetX = vars.GAME_WIDTH - (targetX - vars.GAME_WIDTH);
    }
    targetX += vars.ball.size.w / 2;
  }
  else
    targetX = vars.GAME_WIDTH / 2;

  targetX = Math.max(
    vars.player2.racket.size.w / 2,
    Math.min(vars.GAME_WIDTH - vars.player2.racket.size.w / 2, targetX)
  );

  ai.targetX = targetX;
  ai.lastDecisionTime = vars.state.tick;

  if (targetX < racketCenter - 5)
    vars.player2.input.move = -1;
  else if (targetX > racketCenter + 5)
    vars.player2.input.move = 1;
  else
  {
    ai.targetX = null;
    vars.player2.input.move = 0;
  }
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
  const impact = Math.max( -1, Math.min(1, (ballCenter - racketCenter) / (racket.size.w / 2)) );
  const maxAngle = Math.PI / 3;
  const angle = impact * maxAngle;
  ball.speed = Math.min(
    Math.max(ball.speed, vars.rules.baseSpeed) + vars.rules.acceleration,
    vars.rules.maxSpeed
  );
  const speed = ball.speed;

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

function updateBall(vars: Game)
{
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
  {
    vars.state.status = 'game_end';
    if (vars.player2WasHuman)
      void updatebdd(vars);
  }
  else if (vars.roundEndTick > vars.state.tick)
    vars.state.status = 'round_end';

  vars.ball.speed = Math.min(
    vars.ball.speed + vars.rules.acceleration * vars.DT,
    vars.rules.maxSpeed
  );
}

export async function updatebdd(vars: Game)
{
  const infoplayer1 = vars.playerUserData.p1;
  const infoplayer2 = vars.playerUserData.p2;

  if (!infoplayer1 || !infoplayer2)
    return;

  try
  {
    const winner = vars.state.score.p1 > vars.state.score.p2 ? 1 : 2;
    await db.insert(matches).values({
      user1: Number(infoplayer1.id),
      user1Pseudo: infoplayer1.username,
      user1EloChange: winner === 1 ? 10 : -10,
      user2: Number(infoplayer2.id),
      user2Pseudo: infoplayer2.username,
      user2EloChange: winner === 2 ? 10 : -10,
      user1Score: vars.state.score.p1,
      user2Score: vars.state.score.p2,
      idBall1: infoplayer1.skin_ball ?? null,
      idBall2: infoplayer2.skin_ball ?? null,
      skinRac1: infoplayer1.skin_rac ?? null,
      skinRac2: infoplayer2.skin_rac ?? null,
      winner: winner === 1 ? Number(infoplayer1.id) : Number(infoplayer2.id),
    });

    await db.update(users)
      .set({
		wins: Number(infoplayer1.wins) + (winner === 1 ? 1 : 0),
		losses: Number(infoplayer1.losses) + (winner === 2 ? 1 : 0),
		matches: Number(infoplayer1.matches) + 1,
		wallet: Number(infoplayer1.wallet,) + (winner === 1 ? 20 : 10)
	})
      .where(eq(users.id, Number(infoplayer1.id)));

    await db.update(users)
      .set({
		wins: Number(infoplayer2.wins) + (winner === 2 ? 1 : 0),
		losses: Number(infoplayer2.losses) + (winner === 1 ? 1 : 0),
		matches: Number(infoplayer2.matches) + 1,
		wallet: Number(infoplayer2.wallet) + (winner === 2 ? 20 : 10),
	})
      .where(eq(users.id, Number(infoplayer2.id)));
	await db
  }
  catch (error)
  {
    console.error('updatebdd failed', error);
  }
}

export function createGameSession(id: string, config: GameSessionConfig): GameSession
{
  const schedule = (handler: () => void, intervalMs: number) => (globalThis as any).setInterval(handler, intervalMs);
  const unschedule = (handle: any) => (globalThis as any).clearInterval(handle);
  const vars = serverVariable(config as MatchConfig);
  const clients = new Set<WebSocket>();
  const connectedPlayers: ConnectedPlayer[] = [];
  const maxPlayers = config.mode === 'pve' ? 1 : 2;
  let tickInterval: any = null;

  function playerCount() { return (connectedPlayers.length); }
  function isFull() { return (connectedPlayers.length >= maxPlayers); }

  function updatePlayersForSession()
  {
    updateAI(vars, connectedPlayers);
    updateRackets(vars.player1, vars);
    updateRackets(vars.player2, vars);
  }

  function broadcast(message: unknown)
  {
    const packet = JSON.stringify(message);
    for (const cli of clients)
      if (cli.readyState === WebSocket.OPEN)
        cli.send(packet);
  }

  function gameTick()
  {
    vars.state.tick++;
    vars.state.elapsedTime += vars.DT;

    if (vars.waitingForReconnect && vars.state.status === 'waiting' && vars.state.tick >= vars.waitingForReconnectUntilTick)
    {
      const winnerSide = vars.waitingForReconnectSide === 1 ? 2 : 1;
      vars.state.status = 'game_end';
      vars.state.score = winnerSide === 1
        ? { p1: vars.rules.scoreToWin, p2: vars.state.score.p2 }
        : { p1: vars.state.score.p1, p2: vars.rules.scoreToWin };
      vars.waitingForReconnect = false;
      vars.waitingForReconnectSide = null;
      vars.waitingForReconnectUntilTick = 0;
      broadcast({ type: 'gameState', state: buildClientGameState(vars) });
      return;
    }

    if (vars.state.status === 'round_end')
    {
      updatePlayersForSession();
      if (vars.state.tick >= vars.roundEndTick)
      {
        if (vars.waitingForReconnect)
        {
          vars.state.status = 'waiting';
          vars.ready.p1 = connectedPlayers.some(client => client.player === vars.player1);
          vars.ready.p2 = connectedPlayers.some(client => client.player === vars.player2);
        }
        else
          vars.state.status = 'playing';
      }
    }
    else if (vars.state.status === 'countdown')
    {
      updatePlayersForSession();
      if (vars.state.tick >= vars.countdownEndTick)
      {
        if (vars.countdownLaunchVelocity)
        {
          vars.ball.vel.x = vars.countdownLaunchVelocity.x;
          vars.ball.vel.y = vars.countdownLaunchVelocity.y;
        }
        vars.countdownLaunchVelocity = null;
        vars.state.status = 'playing';
      }
    }
    else if (vars.state.status === 'playing')
    {
      updatePlayersForSession();
      updateBall(vars);
    }

    broadcast({ type: 'gameState', state: buildClientGameState(vars) });
  }

  function start()
  {
    if (tickInterval)
      return;
    tickInterval = schedule(() => { gameTick(); }, vars.TICK_INTERVAL);
  }

  function stop()
  {
    if (!tickInterval)
      return;
    unschedule(tickInterval);
    tickInterval = null;
  }

  function getAvailableSide()
  {
    const hasP1 = connectedPlayers.some(client => client.player === vars.player1);
    const hasP2 = connectedPlayers.some(client => client.player === vars.player2);

    if (!hasP1)
      return ({ side: 1 as const, player: vars.player1 });
    if (!hasP2)
      return ({ side: 2 as const, player: vars.player2 });
    return (null);
  }

  function isAuthorizedForSide(side: PlayerSide, userId?: string)
  {
    if (vars.mode !== 'pvp')
      return (true);
    if (!userId)
      return (false);

    const storedUserId = side === 1 ? vars.playerUserIds.p1 : vars.playerUserIds.p2;
    return (storedUserId === null || storedUserId === userId);
  }

  function rememberUserForSide(side: PlayerSide, userId?: string, user?: GameUserData)
  {
    if (vars.mode !== 'pvp')
      return;

    if (user && side === 1 && vars.playerUserData.p1 === null)
      vars.playerUserData.p1 = user;
    else if (user && side === 2 && vars.playerUserData.p2 === null)
      vars.playerUserData.p2 = user;

    if (!userId)
      return;

    if (side === 1 && vars.playerUserIds.p1 === null)
      vars.playerUserIds.p1 = userId;
    else if (side === 2 && vars.playerUserIds.p2 === null)
      vars.playerUserIds.p2 = userId;
  }

  function broadcastPlayerAssignments()
  {
    for (const cli of clients)
    {
      if (cli.readyState !== WebSocket.OPEN)
        continue;

      const player = connectedPlayers.find(client => client.socket === cli)?.player;
      if (!player)
        continue;

      const side = getPlayerSide(vars, player);
      const payload = JSON.stringify({
        type: 'playerAssigned',
        side,
        instanceId: id,
        opponentUsername: getOpponentUsername(side),
        opponentSkinRac: getOpponentSkinRac(side)
      });
      cli.send(payload);
    }
  }

  function addClient(socket: WebSocket, userId?: string, user?: GameUserData): PlayerSide | null
  {
    if (connectedPlayers.length >= maxPlayers)
    {
      socket.close(1013, 'Game is full');
      return (null);
    }

    const availableSlot = getAvailableSide();
    if (!availableSlot)
    {
      socket.close(1013, 'Game is full');
      return (null);
    }

    if (!isAuthorizedForSide(availableSlot.side, userId))
    {
      socket.close(1008, 'Unauthorized player for this slot');
      return (null);
    }

    clients.add(socket);
    const player = availableSlot.player;
    connectedPlayers.push({ socket, player });
    const side = getPlayerSide(vars, player);
    rememberUserForSide(side, userId, user);

    if (vars.waitingForReconnect && side === vars.waitingForReconnectSide)
    {
      vars.waitingForReconnect = false;
      vars.waitingForReconnectSide = null;
      vars.waitingForReconnectUntilTick = 0;
      vars.ready.p1 = connectedPlayers.some(client => client.player === vars.player1);
      vars.ready.p2 = connectedPlayers.some(client => client.player === vars.player2);
      vars.countdownLaunchVelocity = { x: vars.ball.vel.x, y: vars.ball.vel.y };
      vars.ball.vel.x = 0;
      vars.ball.vel.y = 0;
      vars.countdownEndTick = vars.state.tick + vars.MATCH_START_COUNTDOWN_TICKS;
      vars.state.status = 'countdown';
      broadcastPlayerAssignments();
      return (side);
    }
    if (vars.waitingForReconnect && side !== vars.waitingForReconnectSide)
    {
      connectedPlayers.pop();
      clients.delete(socket);
      socket.close(1008, 'Wrong player slot for reconnect');
      return (null);
    }

    if (side === 1)
      vars.ready.p1 = false;
    else
    {
      vars.ready.p2 = false;
      vars.player2WasHuman = true;
    }
    if (vars.mode === 'pve' && !vars.player2WasHuman && !connectedPlayers.some(client => client.player === vars.player2))
      vars.ready.p2 = true;
    maybeStartMatch(vars, connectedPlayers);
    broadcastPlayerAssignments();
    return (side);
  }

  function removeClient(socket: WebSocket)
  {
    clients.delete(socket);
    const playerIndex = connectedPlayers.findIndex(client => client.socket === socket);
    if (playerIndex === -1)
      return;

    const removedSide = getPlayerSide(vars, connectedPlayers[playerIndex].player);
    connectedPlayers.splice(playerIndex, 1);
    if (connectedPlayers.length === 0)
    {
      vars.playerUserIds.p1 = null;
      vars.playerUserIds.p2 = null;
      vars.ready.p1 = false;
      vars.ready.p2 = false;
      vars.state.status = 'waiting';
      vars.waitingForReconnect = false;
      vars.waitingForReconnectSide = null;
      vars.waitingForReconnectUntilTick = 0;
      return;
    }
    if (vars.state.status === 'playing' || vars.state.status === 'round_end' || vars.state.status === 'countdown')
    {
      vars.waitingForReconnect = true;
      vars.waitingForReconnectSide = removedSide;
      vars.waitingForReconnectUntilTick = vars.state.tick + vars.TICK_RATE * 30;
      return;
    }

    if (removedSide === 1)
      vars.playerUserIds.p1 = null;
    else
      vars.playerUserIds.p2 = null;

    vars.state.status = 'waiting';
    vars.ready.p1 = connectedPlayers.some(client => client.player === vars.player1);
    vars.ready.p2 = connectedPlayers.some(client => client.player === vars.player2);
  }

  function storeInputs(socket: WebSocket, message: ClientInputMessage)
  {
    const client = connectedPlayers.find(player => player.socket === socket);
    if (client)
      client.player.input = message.input;
  }

  function setPlayerReady(socket: WebSocket)
  {
    const client = connectedPlayers.find(player => player.socket === socket);
    if (!client)
      return;
    const side = getPlayerSide(vars, client.player);
    if (side === 1)
      vars.ready.p1 = true;
    else
      vars.ready.p2 = true;
    maybeStartMatch(vars, connectedPlayers);
  }

  function getOpponentUsername(side: PlayerSide): string | null
  {
    const opponent = side === 1 ? vars.playerUserData.p2 : vars.playerUserData.p1;
    return opponent?.username ?? null;
  }

  function getOpponentSkinRac(side: PlayerSide): number | string | null
  {
    const opponent = side === 1 ? vars.playerUserData.p2 : vars.playerUserData.p1;
    return opponent?.skin_rac ?? null;
  }

  return {
    id,
    config,
    start,
    stop,
    addClient,
    removeClient,
    storeInputs,
    setPlayerReady,
    getOpponentUsername,
    getOpponentSkinRac,
    playerCount,
    isFull
  };
}
