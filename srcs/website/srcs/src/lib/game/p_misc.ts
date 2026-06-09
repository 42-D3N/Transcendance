import * as game from "./p_var";
import { up_movement } from "./p_mov";
import { up_ball } from "./p_ball"

/**
 * `new_game` is used to initialize all variables for a new round.
 * 
 * `game_vars` contain all variables like rackets and ball.
 */
export function new_game(game_vars: any)
{
  game_vars.ball.elem.style.display = "flex";
  game_vars.ball.speed = game.baseSpeed;
  game_vars.ball.pos.x = game_vars.ball.base_pos.x;
  game_vars.ball.pos.y = game_vars.ball.base_pos.y;
  game_vars.ball.vel.x = Math.random() * (0.7 - (-0.7)) + (-0.7);
  game_vars.ball.vel.y = game.state.last_win;
  length = Math.hypot(game_vars.ball.vel.x, game_vars.ball.vel.y);
  game_vars.ball.vel.x /= length;
  game_vars.ball.vel.y /= length;
  game_vars.use_powerup = false;
}

/**
 * `freeze_and_prediction` is a function that freeze the ball and display the direction of the ball.
 * 
 * `game_vars` contain all variables like rackets and ball.
 * 
 * `freeze_time` define how many time the ball will freeze (in ms).
 */
export function freeze_and_prediction(game_vars: any, freeze_time: number)
{
  let tmp_vel_x = game_vars.ball.vel.x;
  let tmp_vel_y = game_vars.ball.vel.y;
  game_vars.ball.vel.x = 0;
  game_vars.ball.vel.y = 0;
  game_vars.where_elem.style.left = game_vars.ball.pos.x + (game_vars.ball.size.w / 2) + "px";
  game_vars.where_elem.style.top = game_vars.ball.pos.y + (game_vars.ball.size.h / 2) + "px";
  game_vars.where_elem.style.transform = `rotate(${Math.atan2(tmp_vel_y, tmp_vel_x)}rad)`;
  game_vars.where_elem.style.display = "flex";
  length = Math.hypot(tmp_vel_x, tmp_vel_y);
  tmp_vel_x /= length;
  tmp_vel_y /= length;
  setTimeout(() =>
  {
    game_vars.ball.vel.x = tmp_vel_x;
    game_vars.ball.vel.y = tmp_vel_y;
    game_vars.where_elem.style.display = "none";
  }, freeze_time);
}

/**
 * `game_loop` is the main loop of the game.
 * 
 * `game_vars` contain all variables like rackets and ball.
 */
export function game_loop(game_vars: any)
{
  if (game.state.end_game === true)
    return ;
  game.state.time++;
  up_movement(game_vars);
  if (game.state.up)
    up_ball(game_vars);

  if (game.state.score.p1 >= game.score_to_win || game.state.score.p2 >= game.score_to_win)
  {
    console.log(`GG PLAYER ${game.state.score.p1 >= game.score_to_win ? 1 : 2}`);
    game.state.end_game = true;
    game.state.running = false;
  }
  else
    game.state.restart = true;
  if (game.state.end_round === true && game.state.restart === true && game.state.end_game === false)
  {
    game.state.up = !game.state.up;
    game.state.restart = false;
    game.state.end_round = false;
    new_game(game_vars);
    freeze_and_prediction(game_vars, 1000);
  }
  requestAnimationFrame(function() { game_loop(game_vars) });
}
