import type { PlayerInput } from "../both/interfaces";

export function connection(socket: WebSocket)
{
  socket.onopen = () => { console.log("Connected"); };
  socket.onmessage = event => { console.log(event.data); };
}

export function ping(socket: WebSocket)
{
  socket.send(JSON.stringify({ type: "ping" }));
}

export function sendInput(socket: WebSocket, input: PlayerInput)
{
  socket.send(JSON.stringify({ type: "input", input }));
}
