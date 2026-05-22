const circle = document.getElementById("circle");
const baseCircleX = circle.getBoundingClientRect().left;
const baseCircleY = circle.getBoundingClientRect().top;
let ball = 
{
  id: 0,
  name: 'ball',
  speed: 1.2,
  angle: Math.PI / 4,

  pos: { x: baseCircleX, y: baseCircleY },
  vel: { x: 1, y: 1 }
}
let up = false;
let length = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);
ball.vel.x /= length;
ball.vel.y /= length;

const racketDown_elem = document.getElementById("racketDown");
let racketDown =
{
  id: 0,
  name: 'racketDown',
  pos: { x: racketDown_elem.getBoundingClientRect().left, y: racketDown_elem.getBoundingClientRect().top },
  keys: { left: false, right: false }
}

const racketUp_elem = document.getElementById("racketUp");
let racketUp =
{
  id: 0,
  name: 'racketUp',
  pos: { x: racketUp_elem.getBoundingClientRect().left, y: racketUp_elem.getBoundingClientRect().top },
  keys: { left: false, right: false }
}

function bounceBall(ball, racket, isTopRacket)
{
  let relativeIntersect = (ball.pos.x + 15 - racket.pos.x + 40) / 40;
  relativeIntersect = Math.max(-1, Math.min(1, relativeIntersect));
  const maxAngle = Math.PI / 3;
  const angle = relativeIntersect * maxAngle;

  ball.vel.x = Math.sin(angle);
  if (isTopRacket)
    ball.vel.y = Math.abs(Math.cos(angle));
  else
    ball.vel.y = -Math.abs(Math.cos(angle));
  const length = Math.hypot(ball.vel.x, ball.vel.y);
  ball.vel.x /= length;
  ball.vel.y /= length;
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
    if (ball.pos.y + 30 >= racketDown.pos.y && ball.pos.y + 30 <= racketDown.pos.y + 20
      && ball.pos.x + 30 >= racketDown.pos.x && ball.pos.x <= racketDown.pos.x + 80)
    {
      bounceBall(ball, racketDown, false);
      if (ball.speed < 9.8)
          ball.speed += 0.2;
    }

    // Hit with racketUp
    else if (ball.pos.y >= racketUp.pos.y && ball.pos.y <= racketUp.pos.y + 10
      && ball.pos.x + 30 >= racketUp.pos.x && ball.pos.x <= racketUp.pos.x + 80)
    {
      bounceBall(ball, racketUp, true);
      if (ball.speed < 9.8)
          ball.speed += 0.2;
    }

    // Hit up or down for loose
    else if (ball.pos.y > 600 || ball.pos.y < 100)
    {
      ball.pos.x = 1000;
      ball.pos.y = 1000;
      up = false;
    }
    // ball.angle = Math.atan2(ball.vel.y, ball.vel.x);
    circle.style.left = ball.pos.x + "px";
    circle.style.top = ball.pos.y + "px";
  }
  requestAnimationFrame(update_ball);
}

function update_rackets()
{
  if (up)
  {
    if (racketDown.keys.left === true)
        racketDown.pos.x -= 5;
    else if (racketDown.keys.right === true)
        racketDown.pos.x += 5;
    if (racketDown.pos.x > 450)
      racketDown.pos.x = 450;
    else if (racketDown.pos.x < 100)
      racketDown.pos.x = 100;
    if (racketUp.keys.left === true)
        racketUp.pos.x -= 5;
    else if (racketUp.keys.right === true)
        racketUp.pos.x += 5;
    if (racketUp.pos.x > 450)
      racketUp.pos.x = 450;
    else if (racketUp.pos.x < 100)
      racketUp.pos.x = 100;
    racketDown_elem.style.left = racketDown.pos.x + "px";
    racketUp_elem.style.left = racketUp.pos.x + "px";
  }
  requestAnimationFrame(update_rackets);
}

document.addEventListener("keydown", (e) =>
{
  if (e.key === "Enter")
    up = !up;
  else if (e.key === "ArrowRight")
  {
    racketDown.keys.left = false;
    racketDown.keys.right = true;
  }
  else if (e.key === "ArrowLeft")
  {
    racketDown.keys.left = true;
    racketDown.keys.right = false;
  }
  else if (e.key === "d")
  {
    racketUp.keys.left = false;
    racketUp.keys.right = true;
  }
  else if (e.key === "a")
  {
    racketUp.keys.left = true;
    racketUp.keys.right = false;
  }
  else if (e.key === "+")
    ball.speed++;
  else if (e.key === "-")
    ball.speed--;
  else if (e.key === "Backspace")
  {
    ball.pos.x = baseCircleX;
    ball.pos.y = baseCircleY;
    ball.speed = 1.2;
  }
  circle.style.left = ball.pos.x + "px";
  circle.style.top = ball.pos.y + "px";
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

update_ball();
update_rackets();
