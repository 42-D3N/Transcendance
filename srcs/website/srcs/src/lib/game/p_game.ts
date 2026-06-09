import { game_loop, new_game } from "./p_misc";

/**
 * `core` is the function that listen for keyboard inputs and start the game.
 * 
 * `game_vars` contain all variables like rackets and ball.
 */
export function core(game_vars: any)
{
  document.addEventListener("keydown", (e) =>
  {
    if (e.key === "Backspace" && game_vars.running === false && game_vars.end_game_vars === false && game_vars.end_round === false)
      {
        game_vars.end_game_vars = true;
        game_vars.running = true;
      }
    if (game_vars.end_game_vars === true)
      return ;
    if (e.key === "Enter") // Debug to freeze
      game_vars.up = !game_vars.up;
    if (e.key === "ArrowRight")
    {
      game_vars.racketDown.keys.left = false;
      game_vars.racketDown.keys.right = true;
    }
    if (e.key === "ArrowLeft")
    {
      game_vars.racketDown.keys.left = true;
      game_vars.racketDown.keys.right = false;
    }
    if (e.key === "Shift" && (game_vars.ball.pos.y > (game_vars.terrain.height / 2) || game_vars.ball.vel.y > 0))
    {
      console.log(`idkshfyusdghuo`);
      game_vars.use_powerup = !game_vars.use_powerup;
    }
    if (e.key === "d")
    {
      game_vars.racketUp.keys.left = false;
      game_vars.racketUp.keys.right = true;
    }
    else if (e.key === "a")
    {
      game_vars.racketUp.keys.left = true;
      game_vars.racketUp.keys.right = false;
    }
    else if (e.key === "+") // Debug to increase ball speed
      game_vars.ball.speed++;
    else if (e.key === "-") // Debug to decrease ball speed
      game_vars.ball.speed--;
    game_vars.ball_elem.style.left = game_vars.ball.pos.x + "px";
    game_vars.ball_elem.style.top = game_vars.ball.pos.y + "px";
  });

  document.addEventListener("keyup", (e) =>
  {
    if (e.key === "ArrowRight")
      game_vars.racketDown.keys.right = false;
    else if (e.key === "ArrowLeft")
      game_vars.racketDown.keys.left = false;
    else if (e.key === "d")
      game_vars.racketUp.keys.right = false;
    else if (e.key === "a")
      game_vars.racketUp.keys.left = false;
  });

  new_game(game_vars);
  game_loop(game_vars);
}
