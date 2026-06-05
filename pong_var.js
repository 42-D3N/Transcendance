const terrain_elem = document.getElementById("background");
const racketDown_elem = document.getElementById("racketDown");
const racketUp_elem = document.getElementById("racketUp");
const ball_elem = document.getElementById("circle");
const where_elem = document.getElementById("where");

const maxSpeed = 12;
const baseSpeed = 6;
const acceleration = 0.1;
const racket_speed = 10;
const score_to_win = 15

let last_win = 1;
let restart = false;
let end_round = false;
let running = false;
let up = false;
let length;
let score = { p1: 0, p2: 0 }
let end_game = false;
let time = 0;
let use_powerup = false;

let ball = 
{
  id: 0,
  name: 'ball',
  speed: 6,
  tmp_speed: 0,
  elem: ball_elem,

  base_pos: { x: ball_elem.getBoundingClientRect().left, y:  ball_elem.getBoundingClientRect().top },
  pos:      { x: ball_elem.getBoundingClientRect().left, y:  ball_elem.getBoundingClientRect().top },
  size:     { w: ball_elem.getBoundingClientRect().width, h: ball_elem.getBoundingClientRect().height },
  vel:      { x: 0, y: 0 }
}

let racketUp =
{
  id: 1,
  name: 'racketUp',
  elem: racketUp_elem,

  pos:  { x: racketUp_elem.getBoundingClientRect().left,  y: racketUp_elem.getBoundingClientRect().top },
  size: { w: racketUp_elem.getBoundingClientRect().width, h: racketUp_elem.getBoundingClientRect().height },
  keys: { left: false, right: false },
  movement: 0
}

let racketDown =
{
  id: 2,
  name: 'racketDown',
  elem: racketDown_elem,

  pos:  { x: racketDown_elem.getBoundingClientRect().left,  y: racketDown_elem.getBoundingClientRect().top },
  size: { w: racketDown_elem.getBoundingClientRect().width, h: racketDown_elem.getBoundingClientRect().height },
  keys: { left: false, right: false },
  movement: 0
}

let terrain =
{
  id: 3,
  elem: terrain_elem,

  pos:    { x: terrain_elem.getBoundingClientRect().left, y: terrain_elem.getBoundingClientRect().top },
  width:  terrain_elem.getBoundingClientRect().width,
  height: terrain_elem.getBoundingClientRect().height
}

let where =
{
  id: 4,
  name: 'ball_dir',
  elem: where_elem,

  pos: { x: where_elem.getBoundingClientRect().left, y: where_elem.getBoundingClientRect().top },
}

let easyLevelAI =
{
  id: 5,
  reactionTime: 5,
  errorMarging: 150
}

let normalLevelAI =
{
  id: 6,
  reactionTime: 5,
  errorMarging: 150
}

let hardLevelAI =
{
  id: 7,
  reactionTime: 5,
  errorMarging: 150
}

let impossibleLevelAI =
{
  id: 8,
  reactionTime: 1,
  errorMarging: 0.0001
}
