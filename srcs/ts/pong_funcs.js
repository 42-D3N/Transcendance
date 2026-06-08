function new_game()
{
  ball.elem.style.display = "flex";
  ball.speed = baseSpeed;
  ball.pos.x = ball.base_pos.x;
  ball.pos.y = ball.base_pos.y;
  ball.vel.x = Math.random() * (0.7 - (-0.7)) + (-0.7);
  ball.vel.y = last_win;
  length = Math.hypot(ball.vel.x, ball.vel.y);
  ball.vel.x /= length;
  ball.vel.y /= length;
  use_powerup = false;
}

function freeze_and_prediction(freeze_time)
{
  let tmp_vel_x = ball.vel.x;
  let tmp_vel_y = ball.vel.y;
  ball.vel.x = 0;
  ball.vel.y = 0;
  where_elem.style.left = ball.pos.x + (ball.size.w / 2) + "px";
  where_elem.style.top = ball.pos.y + (ball.size.h / 2) + "px";
  where_elem.style.transform = `rotate(${Math.atan2(tmp_vel_y, tmp_vel_x)}rad)`;
  where_elem.style.display = "flex";
  length = Math.hypot(tmp_vel_x, tmp_vel_y);
  tmp_vel_x /= length;
  tmp_vel_y /= length;
  setTimeout(() =>
  {
    ball.vel.x = tmp_vel_x;
    ball.vel.y = tmp_vel_y;
    where_elem.style.display = "none";
  }, freeze_time);
}

function game_loop()
{
  if (end_game === true)
    return ;
  time++;
  up_movement(time);
  if (up)
    up_ball();

  if (score.p1 >= score_to_win || score.p2 >= score_to_win)
  {
    console.log(`GG PLAYER ${score.p1 >= score_to_win ? 1 : 2}`);
    end_game = true;
    running = false;
  }
  else
    restart = true;
  if (end_round === true && restart === true && end_game === false)
  {
    up = !up;
    restart = false;
    end_round = false;
    new_game();
    freeze_and_prediction(1000);
  }
  requestAnimationFrame(game_loop);
}
