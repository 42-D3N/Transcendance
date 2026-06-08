function bounceBall(ball, racket)
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

function collide(racket, ball)
{
  return (
    ball.pos.x < racket.pos.x + racket.size.w &&
    ball.pos.x + ball.size.w > racket.pos.x &&
    ball.pos.y < racket.pos.y + racket.size.h &&
    ball.pos.y + ball.size.h > racket.pos.y
  );
}

function up_ball()
{
  if (ball.vel.y > 0 && ball.tmp_speed != 0)
  {
    ball.speed = ball.tmp_speed;
    ball.tmp_speed = 0;
  }
  ball.pos.x += ball.vel.x * ball.speed;
  ball.pos.y += ball.vel.y * ball.speed;

  if (use_powerup === true && ball.vel.y < 0 && ball.pos.y <= (terrain.height / 2))
  {
    let tmp_vel_mod;
    tmp_vel_mod = Math.random() * (0.8 - (-0.8)) + (-0.8);
    if (Math.abs(tmp_vel_mod) < 0.2)
      tmp_vel_mod *= 3;
    ball.vel.x += tmp_vel_mod;
    ball.tmp_speed = ball.speed;
    ball.speed = ball.tmp_speed * 2;
    freeze_and_prediction(150);
    use_powerup = false;
  }

  // Wall hit left & right
  if (ball.pos.x > terrain.pos.x + terrain.width - ball.size.w || ball.pos.x < terrain.pos.x)
  {
    if (ball.pos.x > terrain.pos.x + terrain.width - ball.size.w)
      ball.pos.x = terrain.pos.x + terrain.width - ball.size.w;
    else if (ball.pos.x < terrain.pos.x)
      ball.pos.x = terrain.pos.x;
    ball.vel.x = -ball.vel.x;
    if (ball.speed < maxSpeed - acceleration)
      ball.speed += acceleration;
  }

  // Hit with racketDown
  if (collide(racketDown, ball) && ball.vel.y > 0)
  {
    bounceBall(ball, racketDown);
    if (ball.speed < maxSpeed - acceleration)
        ball.speed += acceleration;
    ball.pos.y = racketDown.pos.y - ball.size.h;
  }

  // Hit with racketUp
  else if (collide(racketUp, ball) && ball.vel.y < 0)
  {
    bounceBall(ball, racketUp);
    if (ball.speed < maxSpeed - acceleration)
        ball.speed += acceleration;
    ball.pos.y = racketUp.pos.y + racketUp.size.h;
  }

  // Hit up or down for loose
  else if (ball.pos.y > terrain.pos.y + terrain.height - ball.size.h || ball.pos.y < terrain.pos.y)
  {
    if (ball.pos.y > terrain.pos.y + terrain.height - ball.size.h)
    {
      score.p1++;
      last_win = 1;
    }
    else
    {
      score.p2++;
      last_win = -1;
    }
    console.log(`p1 : ${score.p1} / p2 : ${score.p2}`);
    ball.elem.style.display = "none";
    up = false;
    end_round = true;
  }
  ball.elem.style.left = ball.pos.x + "px";
  ball.elem.style.top = ball.pos.y + "px";
}
