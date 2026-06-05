document.addEventListener("keydown", (e) =>
{
  if (e.key === "Backspace" && running === false && end_game === false && end_round === false)
    {
      end_round = true;
      running = true;
    }
  if (end_game === true)
    return ;
  if (e.key === "Enter") // Debug to freeze
    up = !up;
  if (e.key === "ArrowRight")
  {
    racketDown.keys.left = false;
    racketDown.keys.right = true;
  }
  if (e.key === "ArrowLeft")
  {
    racketDown.keys.left = true;
    racketDown.keys.right = false;
  }
  if (e.key === "Shift" && (ball.pos.y > (terrain.height / 2) || ball.vel.y > 0))
    use_powerup = !use_powerup;
  if (e.key === "d")
  {
    racketUp.keys.left = false;
    racketUp.keys.right = true;
  }
  else if (e.key === "a")
  {
    racketUp.keys.left = true;
    racketUp.keys.right = false;
  }
  else if (e.key === "+") // Debug to increase ball speed
    ball.speed++;
  else if (e.key === "-") // Debug to decrease ball speed
    ball.speed--;
  ball_elem.style.left = ball.pos.x + "px";
  ball_elem.style.top = ball.pos.y + "px";
});

document.addEventListener("keyup", (e) =>
{
  if (e.key === "ArrowRight")
    racketDown.keys.right = false;
  else if (e.key === "ArrowLeft")
    racketDown.keys.left = false;
  else if (e.key === "d")
    racketUp.keys.right = false;
  else if (e.key === "a")
    racketUp.keys.left = false;
});

new_game();
game_loop();
