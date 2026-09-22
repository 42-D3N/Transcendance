import { createGameSession } from './game.ts';
import type { GameSession, GameSessionConfig } from './game.ts';
import type { AIDifficulty, MatchMode } from './pongVariables.ts';

export interface GameUserData
{
  id: number | string;
  username: string;
  wins: number;
  losses: number;
  matches: number;
  wallet: number;
  icon?: string | null;
  skin_rac?: number | null;
  skin_ball?: number | null;
}

export interface JoinGameRequest
{
  mode?: MatchMode;
  aiDifficulty?: AIDifficulty;
  instanceId?: string;
  userId?: string;
  user?: GameUserData;
}

export interface JoinGameResult
{
  instanceId: string;
  side: 1 | 2 | null;
  config: GameSessionConfig;
}

export class GameInstanceManager
{
  private sessions = new Map<string, GameSession>();
  private waitingPvpInstanceId: string | null = null;
  private nextId = 1;

  private createSession(config: GameSessionConfig)
  {
    const instanceId = `game-${this.nextId++}`;
    const session = createGameSession(instanceId, config);
    session.start();
    this.sessions.set(instanceId, session);
    if (config.mode === 'pvp')
      this.waitingPvpInstanceId = instanceId;
    return (session);
  }

  private getNormalizedConfig(request?: JoinGameRequest): GameSessionConfig
  {
    return {
      mode: request?.mode ?? 'pvp',
      aiDifficulty: request?.aiDifficulty
    };
  }

  private pickSession(config: GameSessionConfig, request?: JoinGameRequest)
  {
    if (request?.instanceId)
    {
      const direct = this.sessions.get(request.instanceId);
      if (direct && direct.config.mode === config.mode && !direct.isFull())
        return (direct);
    }

    if (config.mode === 'pvp')
    {
      if (this.waitingPvpInstanceId)
      {
        const waiting = this.sessions.get(this.waitingPvpInstanceId);
        if (waiting && !waiting.isFull())
          return (waiting);
      }
      return (this.createSession(config));
    }

    return (this.createSession(config));
  }

  private cleanupIfEmpty(session: GameSession)
  {
    if (session.playerCount() !== 0)
      return;

    if (this.waitingPvpInstanceId === session.id)
      this.waitingPvpInstanceId = null;

    session.stop();
    this.sessions.delete(session.id);
  }

  public join(socket: WebSocket, request?: JoinGameRequest): JoinGameResult
  {
    const config = this.getNormalizedConfig(request);
    const session = this.pickSession(config, request);
    const side = session.addClient(socket, request?.userId, request?.user);

    if (session.config.mode === 'pvp' && session.isFull() && this.waitingPvpInstanceId === session.id)
      this.waitingPvpInstanceId = null;
    return {
      instanceId: session.id,
      side,
      config: session.config
    };
  }

  public leave(instanceId: string, socket: WebSocket)
  {
    const session = this.sessions.get(instanceId);
    if (!session)
      return;

    session.removeClient(socket);

    if (session.config.mode === 'pvp' && !session.isFull() && session.playerCount() > 0)
      this.waitingPvpInstanceId = session.id;

    this.cleanupIfEmpty(session);
  }

  public storeInputs(instanceId: string, socket: WebSocket, message: Parameters<GameSession['storeInputs']>[1])
  {
    const session = this.sessions.get(instanceId);
    if (!session)
      return;

    session.storeInputs(socket, message);
  }

  public setReady(instanceId: string, socket: WebSocket)
  {
    const session = this.sessions.get(instanceId);
    if (!session)
      return;

    session.setPlayerReady(socket);
  }

  public getOpponentUsername(instanceId: string, side: 1 | 2): string | null
  {
    const session = this.sessions.get(instanceId);
    if (!session)
      return null;

    return session.getOpponentUsername(side);
  }

  public getOpponentSkinRac(instanceId: string, side: 1 | 2): number | string | null
  {
    const session = this.sessions.get(instanceId);
    if (!session)
      return null;

    return session.getOpponentSkinRac(side);
  }
}
