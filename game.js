const circle = document.getElementById("circle");
const baseCircleX = circle.getBoundingClientRect().left;
const baseCircleY = circle.getBoundingClientRect().top;
const racketDown_elem = document.getElementById("racketDown");
const racketUp_elem = document.getElementById("racketUp");

let last_win = 1;
let up = false;
let length;
let score = { p1: 0, p2: 0 }
let end_game = false;
let movement = 0;
let time = 0;
let easyLevelAI =
{
  id: 3,
  reactionTime: 5,
  errorMarging: 150
}
let normalLevelAI =
{
  id: 4,
  reactionTime: 5,
  errorMarging: 150
}
let hardLevelAI =
{
  id: 5,
  reactionTime: 5,
  errorMarging: 150
}
let impossibleLevelAI =
{
  id: 6,
  reactionTime: 1,
  errorMarging: 0.0001
}

let ball = 
{
  id: 0,
  name: 'ball',
  speed: 3,

  pos: { x: baseCircleX, y: baseCircleY },
  size: { w: circle.getBoundingClientRect().width, h: circle.getBoundingClientRect().height },
  vel: { x: 0, y: 0 }
}

let racketUp =
{
  id: 1,
  name: 'racketUp',
  pos: { x: racketUp_elem.getBoundingClientRect().left, y: racketUp_elem.getBoundingClientRect().top },
  size: { w: racketUp_elem.getBoundingClientRect().width, h: racketUp_elem.getBoundingClientRect().height },
  keys: { left: false, right: false }
}
let racketDown =
{
  id: 2,
  name: 'racketDown',
  pos: { x: racketDown_elem.getBoundingClientRect().left, y: racketDown_elem.getBoundingClientRect().top },
  size: { w: racketDown_elem.getBoundingClientRect().width, h: racketDown_elem.getBoundingClientRect().height },
  keys: { left: false, right: false }
}


document.addEventListener("keydown", (e) =>
{
  if (end_game == true)
    return ;
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
  else if (e.key === "+") // Debug to increase ball speed
    ball.speed++;
  else if (e.key === "-") // Debug to decrease ball speed
    ball.speed--;
  else if (e.key === "Backspace")
  {
    new_game();
    up = !up;
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

new_game();
update_ball();
update_rackets();
