import { freeze_and_prediction } from "./p_misc"

export function bounceball(ball: any, racket: any)
{
  const ballCenter = ball.pos.x + (ball.size.h / 2);
  const racketCenter = racket.pos.x + (racket.size.w / 2);

  let relativeIntersect = (ballCenter - racketCenter) / (racket.size.w / 2);

  relativeIntersect = Math.max(-1, Math.min(1, relativeIntersect));
  ball.vel.x += relativeIntersect * 0.75 ;
  ball.vel.y *= -1;
  if (Math.abs(ball.vel.y) < 0.35)
    ball.vel.y = 0.35 * Math.sign(ball.vel.y);
  const length = Math.hypot(ball.vel.x, ball.vel.y);

  ball.vel.x /= length;
  ball.vel.y /= length;
}

export function collide(racket: any, ball: any)
{
  return (
    ball.pos.x < racket.pos.x + racket.size.w &&
    ball.pos.x + ball.size.w > racket.pos.x &&
    ball.pos.y < racket.pos.y + racket.size.h &&
    ball.pos.y + ball.size.h > racket.pos.y
  );
}

export function up_ball(game_vars: any)
{
  if (game_vars.ball.vel.y > 0 && game_vars.ball.tmp_speed != 0)
  {
    game_vars.ball.speed = game_vars.ball.tmp_speed;
    game_vars.ball.tmp_speed = 0;
  }
  game_vars.ball.pos.x += game_vars.ball.vel.x * game_vars.ball.speed;
  game_vars.ball.pos.y += game_vars.ball.vel.y * game_vars.ball.speed;

  if (game_vars.state.use_powerup === true && game_vars.ball.vel.y < 0 && game_vars.ball.pos.y <= (game_vars.terrain.height / 2))
  {
    let tmp_vel_mod;
    tmp_vel_mod = Math.random() * (0.8 - (-0.8)) + (-0.8);
    if (Math.abs(tmp_vel_mod) < 0.2)
      tmp_vel_mod *= 3;
    game_vars.ball.vel.x += tmp_vel_mod;
    game_vars.ball.tmp_speed = game_vars.ball.speed;
    game_vars.ball.speed = game_vars.ball.tmp_speed * 2;
    freeze_and_prediction(game_vars, 250);
    game_vars.state.use_powerup = false;
  }

  // Wall hit left & right
  if (game_vars.ball.pos.x > game_vars.terrain.width - game_vars.ball.size.w || game_vars.ball.pos.x < 0)
  {
    if (game_vars.ball.pos.x > game_vars.terrain.width - game_vars.ball.size.w)
      game_vars.ball.pos.x = game_vars.terrain.width - game_vars.ball.size.w;
    else if (game_vars.ball.pos.x < 0)
      game_vars.ball.pos.x = 0;
    game_vars.ball.vel.x = -game_vars.ball.vel.x;
    if (game_vars.ball.speed < game_vars.maxSpeed - game_vars.acceleration)
      game_vars.ball.speed += game_vars.acceleration;
  }

  // Hit with game_vars.racketDown
  if (collide(game_vars.racketDown, game_vars.ball) && game_vars.ball.vel.y > 0)
  {
    bounceball(game_vars.ball, game_vars.racketDown);
    if (game_vars.ball.speed < game_vars.maxSpeed - game_vars.acceleration)
        game_vars.ball.speed += game_vars.acceleration;
    game_vars.ball.pos.y = game_vars.racketDown.pos.y - game_vars.ball.size.h;
  }

  // Hit with game_vars.racketUp
  else if (collide(game_vars.racketUp, game_vars.ball) && game_vars.ball.vel.y < 0)
  {
    bounceball(game_vars.ball, game_vars.racketUp);
    if (game_vars.ball.speed < game_vars.maxSpeed - game_vars.acceleration)
        game_vars.ball.speed += game_vars.acceleration;
    game_vars.ball.pos.y = game_vars.racketUp.pos.y + game_vars.racketUp.size.h;
  }

  // Hit up or down for loose
  else if (game_vars.ball.pos.y > game_vars.terrain.height - game_vars.ball.size.h || game_vars.ball.pos.y < 0)
  {
    if (game_vars.ball.pos.y > game_vars.terrain.height - game_vars.ball.size.h)
    {
      game_vars.state.score.p1++;
      game_vars.state.last_win = 1;
    }
    else
    {
      game_vars.state.score.p2++;
      game_vars.state.last_win = -1;
    }
    console.log(`p1 : ${game_vars.state.score.p1} / p2 : ${game_vars.state.score.p2}`);
    game_vars.ball.elem.style.display = "none";
    game_vars.state.up = false;
    game_vars.state.end_round = true;
  }
  game_vars.ball.elem.style.width = `${game_vars.ball.size.w * game_vars.scale.x}px`;
  game_vars.ball.elem.style.height = `${game_vars.ball.size.h * game_vars.scale.y}px`;
  game_vars.racketUp.elem.style.width = `${game_vars.racketUp.size.w * game_vars.scale.x}px`;
  game_vars.racketUp.elem.style.height = `${game_vars.racketUp.size.h * game_vars.scale.y}px`;
  game_vars.racketDown.elem.style.width = `${game_vars.racketDown.size.w * game_vars.scale.x}px`;
  game_vars.racketDown.elem.style.height = `${game_vars.racketDown.size.h * game_vars.scale.y}px`;
  game_vars.ball.elem.style.left = `${game_vars.ball.pos.x * game_vars.scale.x}px`;
  game_vars.ball.elem.style.top = `${game_vars.ball.pos.y * game_vars.scale.y}px`;
}
