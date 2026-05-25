
function new_game()
{
  ball.pos.x = baseCircleX;
  ball.pos.y = baseCircleY;
  ball.vel.x = Math.random() * (0.7 - (-0.7)) + (-0.7);
  ball.vel.y = last_win;
  length = Math.hypot(ball.vel.x, ball.vel.y);
  ball.vel.x /= length;
  ball.vel.y /= length;
  ball.speed = 3;
}

function bounceBall(ball, racket, isTopRacket)
{
  const ballCenter = ball.pos.x + 15;
  const racketCenter = racket.pos.x + 40;

  let relativeIntersect = (ballCenter - racketCenter) / 40;

  relativeIntersect = Math.max(-1, Math.min(1, relativeIntersect));
  ball.vel.x += relativeIntersect * 0.75;
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
    ball.pos.y < racket.pos.y + racket.size.h / 2 &&
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
    if (ball.pos.x > 500 || ball.pos.x < 100)
    {
      if (ball.pos.x > 500)
        ball.pos.x = 500;
      else if (ball.pos.x < 100)
        ball.pos.x = 100;
      ball.vel.x = -ball.vel.x;
      if (ball.speed < 9.8)
        ball.speed += 0.2;
    }

    // Hit with racketDown
    if (collide(racketDown, ball) && ball.vel.y > 0)
    {
      bounceBall(ball, racketDown, false);
      if (ball.speed < 9.8)
          ball.speed += 0.2;
      ball.pos.y = racketDown.pos.y - 30;
    }

    // Hit with racketUp
    else if (collide(racketUp, ball) && ball.vel.y < 0)
    {
      bounceBall(ball, racketUp, true);
      if (ball.speed < 9.8)
          ball.speed += 0.2;
      ball.pos.y = racketUp.pos.y + 10;
    }

    // Hit up or down for loose
    else if (ball.pos.y > 600 || ball.pos.y < 100)
    {
      if (ball.pos.y > 600)
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
      if (score.p1 >= 7)
      {
        console.log(`GG PLAYER 1`);
        end_game = true;
      }
      else if (score.p2 >= 7)
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

function update_rackets()
{
  if (up)
  {
    time++;
    if (movement === 0 && time % impossibleLevelAI.reactionTime === 0)
    {
      if (ball.vel.y < 0)
      {
        let timeToReach = (racketUp.pos.y - ball.pos.y) / ball.vel.y;
        let targetX = ball.pos.x + ball.vel.x * timeToReach;
        targetX += (Math.random() - 0.5) * impossibleLevelAI.errorMarging;
        movement = targetX - racketUp.pos.x - 40;
        while (targetX < 0 || targetX > 430)
        {
        if (targetX < 0)
          targetX = -targetX;
        if (targetX > 430)
          targetX = 430 - (targetX - 430);
        }
      }
      else
        movement = 215 - racketUp.pos.x + 40;
    }
    if (racketDown.keys.left === true)
        racketDown.pos.x -= 5;
    else if (racketDown.keys.right === true)
        racketDown.pos.x += 5;
    // if (racketUp.keys.left === true)
    //     racketUp.pos.x -= 5;
    // else if (racketUp.keys.right === true)
    //     racketUp.pos.x += 5;

    if (movement != 0)
    {
      if ((movement < 0 && racketUp.pos.x === 100) || (movement > 0 && racketUp.pos.x === 450))
        movement = 0;
      if (Math.abs(movement) >= 5)
      {
        racketUp.pos.x += 5 * Math.sign(movement);
        movement += 5 * -Math.sign(movement);
      }
      else
      {
        racketUp.pos.x += movement;
        movement = 0;
      }
    }
    if (racketDown.pos.x > 450)
      racketDown.pos.x = 450;
    else if (racketDown.pos.x < 100)
      racketDown.pos.x = 100;
    if (racketUp.pos.x > 450)
      racketUp.pos.x = 450;
    else if (racketUp.pos.x < 100)
      racketUp.pos.x = 100;
    racketDown_elem.style.left = racketDown.pos.x + "px";
    racketUp_elem.style.left = racketUp.pos.x + "px";
  }
  requestAnimationFrame(update_rackets);
}
