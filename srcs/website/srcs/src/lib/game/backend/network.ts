import type { ClientGameState, PlayerInput, ServerMessage } from "../both/interfaces";

export function connection(socket: WebSocket, onGameState: (state: ClientGameState) => void)
{
  socket.onopen = () => { console.log("Connected"); };
  socket.onmessage = event =>
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
    }
  };
}

export function ping(socket: WebSocket)
{
  socket.send(JSON.stringify({ type: "ping" }));
}

export function sendInput(socket: WebSocket, input: PlayerInput)
{
  socket.send(JSON.stringify({ type: "input", input }));
}
