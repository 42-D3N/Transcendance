import type { PlayerInput, ServerMessage } from "../both/interfaces";

export function connection(socket: WebSocket)
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
        console.log("Racket x:", message.state.player1.racket.x, "Racket y:", message.state.player1.racket.y);
        console.log("Ball   x:", message.state.ball.x, "Ball   y:", message.state.ball.y);
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
