function ia_movement_calcul()
{
  if (ball.vel.y < 0 && ball.pos.y >= racketUp.pos.y)
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
    racketUp.movement = (terrain.width / 2) - racketUp.pos.x + racketUp.size.w;
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

function up_movement()
{
  if (racketUp.movement === 0 && time % easyLevelAI.reactionTime === 0)
    ia_movement_calcul();
  user_movement_calcul();
  ia_movement();
  user_movement();
  racketDown.elem.style.left = racketDown.pos.x + "px";
  racketUp.elem.style.left = racketUp.pos.x + "px";
}
