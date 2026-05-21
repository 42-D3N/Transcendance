const circle = document.getElementById("circle");
let ball = 
{
  id: 0,
  name: 'ball',
  speed: 1.2,
  angle: Math.PI / 4,

  pos:
  {
    x: 300,
    y: 300
  },

  vel:
  {
    x: 1,
    y: 1
  }
}
let up = false;
let length = Math.sqrt(ball.vel.x * ball.vel.x + ball.vel.y * ball.vel.y);
ball.vel.x /= length;
ball.vel.y /= length;

function update()
{
  if (up)
  {
    ball.pos.x += ball.vel.x * ball.speed;
    ball.pos.y += ball.vel.y * ball.speed;
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
    if (ball.pos.y > 600 || ball.pos.y < 100)
    {
        if (ball.pos.y > 600)
            ball.pos.y = 600;
        else if (ball.pos.y < 100)
            ball.pos.y = 100;
        ball.vel.y = -ball.vel.y;
        if (ball.speed < 9.8)
            ball.speed += 0.2;
    }
    ball.angle = Math.atan2(ball.vel.y, ball.vel.x);
    circle.style.left = ball.pos.x + "px";
    circle.style.top = ball.pos.y + "px";
  }
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) =>
{
  if (e.key === "Enter")
    up = !up;
  else if (e.key === "ArrowRight")
  {
    ball.angle += Math.PI / 90;
    ball.vel.x = Math.cos(ball.angle);
    ball.vel.y = Math.sin(ball.angle);
  }
  else if (e.key === "ArrowLeft")
  {
    ball.angle -= Math.PI / 90;
    ball.vel.x = Math.cos(ball.angle);
    ball.vel.y = Math.sin(ball.angle);
  }
  else if (e.key === "+")
    ball.speed++;
  else if (e.key === "-")
    ball.speed--;
  circle.style.left = ball.pos.x + "px";
  circle.style.top = ball.pos.y + "px";
});

update();
