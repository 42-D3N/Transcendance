import type { ClientGameState, PlayerInput, ServerMessage } from "../both/interfaces";

function sendIfOpen(socket: WebSocket | null | undefined, payload: unknown)
{
  if (!socket || socket.readyState !== WebSocket.OPEN)
    return;

  socket.send(JSON.stringify(payload));
}

export function connection(
  socket: WebSocket,
  onGameState: (state: ClientGameState) => void,
  onPlayerAssigned?: (side: 1 | 2, instanceId?: string, opponentUsername?: string | null, opponentSkinRac?: number | string | null) => void
)
{
  socket.addEventListener("open", () => { console.log("Connected"); });
  socket.addEventListener("message", event =>
  {
    const message = JSON.parse(event.data.toString()) as ServerMessage;
    switch (message.type)
    {
      case "pong":
        sendIfOpen(socket, { type: "pang" });
        break;
      case "gameState":
        onGameState(message.state);
        break;
      case "playerAssigned":
        onPlayerAssigned?.(message.side, message.instanceId, message.opponentUsername ?? null, message.opponentSkinRac ?? null);
        break;
    }
  });
}

export function ping(socket: WebSocket | null | undefined)
{
  sendIfOpen(socket, { type: "ping" });
}

export function sendInput(socket: WebSocket | null | undefined, input: PlayerInput)
{
  sendIfOpen(socket, { type: "input", input });
}

export function sendReady(socket: WebSocket | null | undefined)
{
  sendIfOpen(socket, { type: "ready" });
}
