function new_game()
{
  ball.pos.x = baseCircleX;
  ball.pos.y = baseCircleY;
  ball.vel.x = Math.random() * (0.7 - (-0.7)) + (-0.7);
  ball.vel.y = last_win;
  length = Math.hypot(ball.vel.x, ball.vel.y);
  ball.vel.x /= length;
  ball.vel.y /= length;
}

function bounceBall(ball, racket, isTopRacket)
{
  const ballCenter = ball.pos.x + ball.size.h;
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

function update_ball()
{
  if (up)
  {
    ball.pos.x += ball.vel.x * ball.speed;
    ball.pos.y += ball.vel.y * ball.speed;

    // Wall hit left & right
    if (ball.pos.x > terrain.pos.x + terrain.width - ball.size.w || ball.pos.x < terrain.pos.x)
    {
      if (ball.pos.x > terrain.pos.x + terrain.width - ball.size.w)
        ball.pos.x = terrain.pos.x + terrain.width - ball.size.w;
      else if (ball.pos.x < terrain.pos.x)
        ball.pos.x = terrain.pos.x;
      ball.vel.x = -ball.vel.x;
      if (ball.speed < max_speed - acceleration)
        ball.speed += acceleration;
    }

    // Hit with racketDown
    if (collide(racketDown, ball) && ball.vel.y > 0)
    {
      bounceBall(ball, racketDown, false);
      if (ball.speed < max_speed - acceleration)
          ball.speed += acceleration;
      ball.pos.y = racketDown.pos.y - ball.size.h;
    }

    // Hit with racketUp
    else if (collide(racketUp, ball) && ball.vel.y < 0)
    {
      bounceBall(ball, racketUp, true);
      if (ball.speed < max_speed - acceleration)
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
      ball.pos.x = 10000;
      ball.pos.y = 350;
      up = false;
      if (score.p1 >= score_to_win)
      {
        console.log(`GG PLAYER 1`);
        end_game = true;
      }
      else if (score.p2 >= score_to_win)
      {
        console.log(`GG PLAYER 2`);
        end_game = true;
      }
	}
    circle.style.left = ball.pos.x + "px";
    circle.style.top = ball.pos.y + "px";
  }
  requestAnimationFrame(update_ball);
}

function ia_movement_calcul()
{
  if (ball.vel.y < 0)
  {
    let timeToReach = (racketUp.pos.y - ball.pos.y) / ball.vel.y;
    let targetX = ball.pos.x + ball.vel.x * timeToReach;
    targetX += ((Math.random() - 0.2) * easyLevelAI.errorMarging) / 2;
    racketUp.movement = targetX - racketUp.pos.x - (racketUp.size.w / 2);
    while (targetX < 0 || targetX > terrain.width)
    {
      if (targetX < 0)
        targetX = -targetX;
      if (targetX > terrain.width)
        targetX = terrain.width - (targetX - terrain.width);
    }
  }
  else
    racketUp.movement = (terrain.width / 2) - racketUp.pos.x + (racketUp.size.w / 2);
}

function user_movement_calcul()
{
  if (racketDown.keys.left === true)
    racketDown.pos.x -= racket_speed;
  else if (racketDown.keys.right === true)
    racketDown.pos.x += racket_speed;
}

function ia_movement()
{
  if (racketUp.movement != 0)
  {
    if ((racketUp.movement < 0 && racketUp.pos.x === terrain.pos.x) ||
        (racketUp.movement > 0 && racketUp.pos.x === terrain.pos.x + terrain.width - racketUp.size.w))
      racketUp.movement = 0;
    if (Math.abs(racketUp.movement) >= racket_speed)
    {
      racketUp.pos.x += racket_speed * Math.sign(racketUp.movement);
      racketUp.movement += racket_speed * -Math.sign(racketUp.movement);
    }
    else
    {
      racketUp.pos.x += racketUp.movement;
      racketUp.movement = 0;
    }
  }
}

function user_movement()
{
  if (racketDown.pos.x > terrain.pos.x + terrain.width - racketDown.size.w)
    racketDown.pos.x = terrain.pos.x + terrain.width - racketDown.size.w;
  else if (racketDown.pos.x < terrain.pos.x)
    racketDown.pos.x = terrain.pos.x;
  if (racketUp.pos.x > terrain.pos.x + terrain.width - racketUp.size.w)
    racketUp.pos.x = terrain.pos.x + terrain.width - racketUp.size.w
  else if (racketUp.pos.x < terrain.pos.x)
    racketUp.pos.x = terrain.pos.x;
}

function update_rackets()
{
  if (up)
  {
    time++;
    if (racketUp.movement === 0 && time % easyLevelAI.reactionTime === 0)
      ia_movement_calcul();
    user_movement_calcul();
    ia_movement();
    user_movement();
    racketDown_elem.style.left = racketDown.pos.x + "px";
    racketUp_elem.style.left = racketUp.pos.x + "px";
  }
  requestAnimationFrame(update_rackets);
}
