import type { ClientGameState, PlayerInput, ServerMessage } from "../both/interfaces";

export function connection(
  socket: WebSocket,
  onGameState: (state: ClientGameState) => void,
  onPlayerAssigned?: (side: 1 | 2, instanceId?: string, opponentUsername?: string | null) => void
)
{
  socket.addEventListener("open", () => { console.log("Connected"); });
  socket.addEventListener("message", event =>
  {
    const message = JSON.parse(event.data.toString()) as ServerMessage;
    switch (message.type)
    {
      case "pong":
        socket.send(JSON.stringify({ type: "pang" }));
        break;
      case "gameState":
        onGameState(message.state);
        break;
      case "playerAssigned":
        onPlayerAssigned?.(message.side, message.instanceId, message.opponentUsername ?? null);
        break;
    }
  });
}

export function ping(socket: WebSocket)
{
  socket.send(JSON.stringify({ type: "ping" }));
}

export function sendInput(socket: WebSocket, input: PlayerInput)
{
  socket.send(JSON.stringify({ type: "input", input }));
}

export function sendReady(socket: WebSocket)
{
  socket.send(JSON.stringify({ type: "ready" }));
}
