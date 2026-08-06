export function updateScale(game_vars: any)
{
  game_vars.scale.x = game_vars.terrain.elem.clientWidth / game_vars.terrain.width;
  game_vars.scale.y = game_vars.terrain.elem.clientHeight / game_vars.terrain.height;
}

export function handleKeyUp(e: KeyboardEvent)
{
  if (e.key === "ArrowRight" || e.key === "ArrowLeft")
    console.log("Send to server player.input.move = 0");
  else if (e.key === "Shift")
    console.log("Send to server player.input.special = 0");
}

export function handleKeyDown(e: KeyboardEvent)
{
  if (e.key === "ArrowRight")
    console.log("Send to server player.input.move = 1");
  if (e.key === "ArrowLeft")
    console.log("Send to server player.input.move = -1");
  if (e.key === "Shift")
    console.log("Send to server player.input.useSpecial()");
}
export function updateBallPosition(game_vars: any)
{
  game_vars.ball_elem.style.left = game_vars.ball.pos.x + "px";
  game_vars.ball_elem.style.top = game_vars.ball.pos.y + "px";
}
