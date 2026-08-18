import type { PlayerInput } from "../both/interfaces";

export function updateScale(game_vars: any)
{
  game_vars.scale.x = game_vars.terrain.elem.clientWidth / game_vars.terrain.width;
  game_vars.scale.y = game_vars.terrain.elem.clientHeight / game_vars.terrain.height;
}

export function updateInput(kb: any, inputs: PlayerInput)
{
  if (kb.left && !kb.right)
    inputs.move = -1;
  else if (kb.right && !kb.left)
    inputs.move = 1;
  else
    inputs.move = 0;
  inputs.special = kb.special;
}

export function handleKeyUp(e: KeyboardEvent, kb: any)
{
  if (e.key === "ArrowRight")
    kb.right = false;
  if (e.key === "ArrowLeft")
    kb.left = false;
  if (e.key === "Shift")
    kb.special = false;
}

export function handleKeyDown(e: KeyboardEvent, kb: any)
{
  if (e.key === "ArrowRight")
    kb.right = true;
  if (e.key === "ArrowLeft")
    kb.left = true;
  if (e.key === "Shift")
    kb.special = true;
}
export function updateBallPosition(game_vars: any)
{
  game_vars.ball_elem.style.left = game_vars.ball.pos.x + "px";
  game_vars.ball_elem.style.top = game_vars.ball.pos.y + "px";
}
