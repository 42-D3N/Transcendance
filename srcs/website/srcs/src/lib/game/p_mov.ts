import * as game from "./p_var"

export function ia_movement_calcul(game_vars: any)
{
  if (game_vars.ball.vel.y < 0 && game_vars.ball.pos.y >= game_vars.racketUp.pos.y)
  {
    let timeToReach = (game_vars.racketUp.pos.y - game_vars.ball.pos.y) / game_vars.ball.vel.y;
    let targetX = game_vars.ball.pos.x + game_vars.ball.vel.x * timeToReach;
    targetX += ((Math.random() - 0.2) * game.aiLevels.easy.errorMarging) / 2;
    game_vars.racketUp.movement = targetX - game_vars.racketUp.pos.x - (game_vars.racketUp.size.w / 2);
    while (targetX < 0 || targetX > game_vars.terrain.width)
    {
      if (targetX < 0)
        targetX = -targetX;
      if (targetX > game_vars.terrain.width)
        targetX = game_vars.terrain.width - (targetX - game_vars.terrain.width);
    }
  }
  else
    game_vars.racketUp.movement = (game_vars.terrain.width / 2) - game_vars.racketUp.pos.x + game_vars.racketUp.size.w;
}

export function user_movement_calcul(game_vars: any)
{
  if (game_vars.racketDown.keys.left === true)
    game_vars.racketDown.pos.x -= game.racket_speed;
  else if (game_vars.racketDown.keys.right === true)
    game_vars.racketDown.pos.x += game.racket_speed;
}

export function ia_movement(game_vars: any)
{
  if (game_vars.racketUp.movement != 0)
  {
    if ((game_vars.racketUp.movement < 0 && game_vars.racketUp.pos.x === game_vars.terrain.pos.x) ||
        (game_vars.racketUp.movement > 0 && game_vars.racketUp.pos.x === game_vars.terrain.pos.x + game_vars.terrain.width - game_vars.racketUp.size.w))
      game_vars.racketUp.movement = 0;
    if (Math.abs(game_vars.racketUp.movement) >= game.racket_speed)
    {
      game_vars.racketUp.pos.x += game.racket_speed * Math.sign(game_vars.racketUp.movement);
      game_vars.racketUp.movement += game.racket_speed * -Math.sign(game_vars.racketUp.movement);
    }
    else
    {
      game_vars.racketUp.pos.x += game_vars.racketUp.movement;
      game_vars.racketUp.movement = 0;
    }
  }
}

export function user_movement(game_vars: any)
{
  if (game_vars.racketDown.pos.x > game_vars.terrain.pos.x + game_vars.terrain.width - game_vars.racketDown.size.w)
    game_vars.racketDown.pos.x = game_vars.terrain.pos.x + game_vars.terrain.width - game_vars.racketDown.size.w;
  else if (game_vars.racketDown.pos.x < game_vars.terrain.pos.x)
    game_vars.racketDown.pos.x = game_vars.terrain.pos.x;
  if (game_vars.racketUp.pos.x > game_vars.terrain.pos.x + game_vars.terrain.width - game_vars.racketUp.size.w)
    game_vars.racketUp.pos.x = game_vars.terrain.pos.x + game_vars.terrain.width - game_vars.racketUp.size.w
  else if (game_vars.racketUp.pos.x < game_vars.terrain.pos.x)
    game_vars.racketUp.pos.x = game_vars.terrain.pos.x;
}

export function up_movement(game_vars: any)
{
  if (game_vars.racketUp.movement === 0 && game.state.time % game.aiLevels.easy.reactionTime === 0)
    ia_movement_calcul(game_vars);
  user_movement_calcul(game_vars);
  ia_movement(game_vars);
  user_movement(game_vars);
  game_vars.racketDown.elem.style.left = game_vars.racketDown.pos.x + "px";
  game_vars.racketUp.elem.style.left = game_vars.racketUp.pos.x + "px";
}
