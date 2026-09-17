import type { PlayerInput } from "../both/interfaces";
import type { ClientGameState } from "../both/interfaces";

export function initGameClient()
{
  const racketDownElem	= document.getElementById("racketDown")		as HTMLElement;
  const racketUpElem	= document.getElementById("racketUp")		as HTMLElement;
  const terrainElem		= document.getElementById("terrain")		as HTMLElement;
  const ballElem		= document.getElementById("ball")			as HTMLElement;
  const whereElem		= document.getElementById("where")			as HTMLElement;
  const scoreElem		= document.getElementById("score")			as HTMLElement;
  const statusElem		= document.getElementById("game-status")	as HTMLElement;

  if (!racketDownElem || !racketUpElem || !terrainElem || !ballElem || !whereElem || !scoreElem || !statusElem)
    throw new Error("Pong element init not found. Please check HTML or ID");

  const scale = { x: 1, y: 1 };
  const network = { connected: false, gameState: null as ClientGameState | null };
  const input: PlayerInput = { move: 0, special: false };

  return {
    terrainElem,
    racketDownElem,
    racketUpElem,
    ballElem,
    whereElem,
    scoreElem,
    statusElem,
    scale,
    input,
    network
  };
}
