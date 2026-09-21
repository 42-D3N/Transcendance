import type { ClientGameState, PlayerInput } from "../both/interfaces";

export function updateScale(game_vars: any)
{
  game_vars.scale.x = game_vars.terrainElem.clientWidth / 650;
  game_vars.scale.y = game_vars.terrainElem.clientHeight / 730;
}

export function updateInput(kb: any, inputs: PlayerInput)
{
  if (kb.left && !kb.right)
    inputs.move = -1;
  else if (kb.right && !kb.left)
    inputs.move = 1;
  else
    inputs.move = 0;
}

export function handleKeyUp(e: KeyboardEvent, kb: any)
{
  if (e.key === "ArrowRight")
    kb.right = false;
  if (e.key === "ArrowLeft")
    kb.left = false;
}

export function handleKeyDown(e: KeyboardEvent, kb: any)
{
  if (e.key === "ArrowRight")
    kb.right = true;
  if (e.key === "ArrowLeft")
    kb.left = true;
}
export function updateBallPosition(game_vars: any)
{
  game_vars.ball_elem.style.left = game_vars.ball.pos.x + "px";
  game_vars.ball_elem.style.top = game_vars.ball.pos.y + "px";
}

export function renderGameState(game_vars: any, state: ClientGameState)
{
  game_vars.network.gameState = state;
  game_vars.racketUpElem.style.left = `${state.player2.racket.x * game_vars.scale.x}px`;
  game_vars.racketUpElem.style.top = `${state.player2.racket.y * game_vars.scale.y}px`;
  game_vars.racketDownElem.style.left = `${state.player1.racket.x * game_vars.scale.x}px`;
  game_vars.racketDownElem.style.top = `${state.player1.racket.y * game_vars.scale.y}px`;
  game_vars.ballElem.style.left = `${state.ball.x * game_vars.scale.x}px`;
  game_vars.ballElem.style.top = `${state.ball.y * game_vars.scale.y}px`;
  if (state.prediction)
  {
    const startX = state.prediction.start.x * game_vars.scale.x;
    const startY = state.prediction.start.y * game_vars.scale.y;
    const endX = state.prediction.end.x * game_vars.scale.x;
    const endY = state.prediction.end.y * game_vars.scale.y;
    const width = Math.hypot(endX - startX, endY - startY);
    const angle = Math.atan2(endY - startY, endX - startX);
    game_vars.whereElem.style.left = `${startX}px`;
    game_vars.whereElem.style.top = `${startY}px`;
    game_vars.whereElem.style.width = `${width}px`;
    game_vars.whereElem.style.transform = `rotate(${angle}rad)`;
  }
  game_vars.whereElem.style.display = state.status === "round_end" ? "block" : "none";
  game_vars.scoreElem.textContent = `${state.score.p1}  -  ${state.score.p2}`;
  if (state.status === "round_end" || state.status === "countdown")
    game_vars.statusElem.textContent = state.countdown !== null ? String(state.countdown) : "3";
  else
    game_vars.statusElem.textContent = state.status === "game_end" ? "Partie terminee"
      : state.status === "waiting" ? "En attente d'un adversaire"
      : state.status === "ready_check" ? "En attente des joueurs"
      : "En jeu";
}
