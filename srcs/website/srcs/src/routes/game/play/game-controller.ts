import type { ClientGameState } from '$lib/game/both/interfaces';
import { connection, sendInput, sendReady } from '$lib/game/backend/network';
import { renderGameState } from '$lib/game/frontend/front';
import type { initGameClient } from '$lib/game/frontend/pongVariables';
import { updateLocalReadyFromState } from './play-page';

export type GameControllerDeps = {
  socket: WebSocket | undefined;
  game: ReturnType<typeof initGameClient>;
  getLocalSide: () => 1 | 2 | null;
  setGameState: (state: ClientGameState | null) => void;
  setLocalReady: (value: boolean) => void;
  setLocalSide: (side: 1 | 2 | null) => void;
  setOpponentUsername: (value: string | null) => void;
  setOpponentSkinRac: (value: number | string | null) => void;
  setCurrentInstanceId: (value: string | null) => void;
};

export function bindSocketHandlers({
  socket,
  game,
  getLocalSide,
  setGameState,
  setLocalReady,
  setLocalSide,
  setOpponentUsername,
  setOpponentSkinRac,
  setCurrentInstanceId,
}: GameControllerDeps) {
  if (!socket)
    return;

  connection(
    socket,
    (state) => {
      setGameState(state);
      const localSide = getLocalSide();
      if (localSide !== null)
        setLocalReady(updateLocalReadyFromState({ localSide, state }));
      renderGameState(game, state);
    },
    (side, instanceId, nextOpponentUsername, nextOpponentSkinRac) => {
      setLocalSide(side);
      setOpponentUsername(nextOpponentUsername ?? null);
      setOpponentSkinRac(nextOpponentSkinRac ?? null);
      if (instanceId)
        setCurrentInstanceId(instanceId);
    }
  );
}

export function clickReady(socket: WebSocket | undefined, localReady: boolean) {
  if (!socket || socket.readyState !== WebSocket.OPEN || localReady)
    return;
  sendReady(socket);
}

export function sendDirectionalInput(socket: WebSocket | undefined, nextMove: -1 | 0 | 1) {
  if (socket?.readyState !== WebSocket.OPEN)
    return;
  sendInput(socket, { move: nextMove });
}

export function createPointerHandlers(
  onMove: (move: -1 | 0 | 1) => void
) {
  return {
    start: (event: PointerEvent, move: -1 | 1) => {
      if (!event.isPrimary)
        return;
      onMove(move);
    },
    stop: (event: PointerEvent) => {
      if (!event.isPrimary)
        return;
      onMove(0);
    },
  };
}
