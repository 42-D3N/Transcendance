import type { AIDifficulty, ClientGameState, MatchMode } from '$lib/game/both/interfaces';

export type GameUserData = {
  id: number;
  username: string;
  wins: number;
  losses: number;
  matches: number;
  wallet: number;
  icon: string | number | null;
  skin_rac?: unknown;
  skin_ball?: unknown;
};

export type PlayerLabels = {
  left: string;
  right: string;
  top: string;
  bottom: string;
};

export function getRequestedMode(value: string | null): MatchMode {
  return value === 'pve' ? 'pve' : 'pvp';
}

export function getRequestedDifficulty(value: string | null): AIDifficulty {
  return value === 'easy' || value === 'normal' || value === 'hard' || value === 'impossible'
    ? value
    : 'easy';
}

export function getPlayerLabels({
  localSide,
  username,
  opponentUsername,
}: {
  localSide: 1 | 2 | null;
  username: string;
  opponentUsername: string | null;
}): PlayerLabels {
  return {
    left: localSide === 1 ? username : (opponentUsername ?? 'PLAYER 1'),
    right: localSide === 1 ? (opponentUsername ?? 'PLAYER 2') : username,
    top: localSide === 2 ? username : (opponentUsername ?? 'PLAYER 2'),
    bottom: localSide === 1 ? username : (opponentUsername ?? 'PLAYER 1'),
  };
}

export function updateLocalReadyFromState({
  localSide,
  state,
}: {
  localSide: 1 | 2 | null;
  state: ClientGameState;
}): boolean {
  if (localSide === 1)
    return state.ready.p1;
  if (localSide === 2)
    return state.ready.p2;
  return false;
}

export function isReadyOverlayVisible(status: ClientGameState['status'] | null | undefined): boolean {
  return !status || status === 'waiting' || status === 'ready_check';
}

export function buildGameUrl({
  host,
  mode,
  aiDifficulty,
  currentInstanceId,
  data,
}: {
  host: string;
  mode: MatchMode;
  aiDifficulty: AIDifficulty;
  currentInstanceId: string | null;
  data: GameUserData;
}): string {
  const userPayload = {
    id: data.id,
    username: data.username,
    wins: data.wins,
    losses: data.losses,
    matches: data.matches,
    wallet: data.wallet,
    icon: data.icon,
    skin_rac: data.skin_rac,
    skin_ball: data.skin_ball,
  };

  const url = new URL('wss://' + host + '/api/game_server');
  url.searchParams.set('mode', mode);
  url.searchParams.set('userId', String(data.id));
  url.searchParams.set('user', JSON.stringify(userPayload));

  if (mode === 'pve')
    url.searchParams.set('aiDifficulty', aiDifficulty);

  if (currentInstanceId)
    url.searchParams.set('instanceId', currentInstanceId);

  return url.toString();
}
