// ----------------------- //
// Elements Declarations : //
// ----------------------- //

const terrain_elem		= document.getElementById("background")	as HTMLElement;
const racketDown_elem	= document.getElementById("racketDown")	as HTMLElement;
const racketUp_elem		= document.getElementById("racketUp")	as HTMLElement;
const where_elem		= document.getElementById("where")		as HTMLElement;
const ball_elem			= document.getElementById("circle")		as HTMLElement;
if (!terrain_elem || !racketDown_elem || !racketUp_elem || !ball_elem || !where_elem)
  throw new Error("Pong element init not found. Please check HTML or ID");

// ------------------------ //
// Gamerules Declarations : //
// ------------------------ //

const acceleration	= 0.1;
const racket_speed	= 10;
const score_to_win	= 15;
const maxSpeed		= 12;
const baseSpeed		= 6;

// ------------------- //
// Misc Declarations : //
// ------------------- //

let len:			number = 0;
let time:			number = 0;
let last_win:		number = 1;
let end_round:		boolean = false;
let use_powerup:	boolean = false;
let end_game:		boolean = false;
let running:		boolean = false;
let restart:		boolean = false;
let up:				boolean = false;

let score: { p1: number; p2: number; } = { p1: 0, p2: 0 };

// ----------------------------- //
// MISC Interface Declarations : //
// ----------------------------- //

interface Position
{
  x: number;
  y: number;
}

interface Size
{
  w: number;
  h: number;
}

interface Velocity
{
  x: number;
  y: number;
}

interface GameObject
{
  id: number;
  elem: HTMLElement;
}

// ------------------- //
// Ball Declarations : //
// ------------------- //

interface Ball extends GameObject
{
  name:			string;
  speed:		number;
  tmp_speed:	number;

  base_pos:		Position;
  pos:			Position;
  size:			Size;
  vel:			Velocity;
}

let ball: Ball =
{
  id:			0,
  name:			"ball",
  speed:		6,
  tmp_speed:	0,
  elem:			ball_elem,

  base_pos:		{ x: ball_elem.getBoundingClientRect().left, y:  ball_elem.getBoundingClientRect().top },
  pos:			{ x: ball_elem.getBoundingClientRect().left, y:  ball_elem.getBoundingClientRect().top },
  size:			{ w: ball_elem.getBoundingClientRect().width, h: ball_elem.getBoundingClientRect().height },
  vel:			{ x: 0, y: 0 }
}

// ---------------------- //
// Rackets Declarations : //
// ---------------------- //

interface Racket extends GameObject
{
  name:		string;
  pos:		Position;
  size:		Size;
  movement:	number;

  keys:
  {
    left:	boolean;
    right:	boolean;
  };
}

let racketUp: Racket =
{
  id: 1,
  name:		'racketUp',
  elem:		racketUp_elem,
  movement:	0,

  pos:		{ x: racketUp_elem.getBoundingClientRect().left,  y: racketUp_elem.getBoundingClientRect().top },
  size:		{ w: racketUp_elem.getBoundingClientRect().width, h: racketUp_elem.getBoundingClientRect().height },
  keys:		{ left: false, right: false }
}

let racketDown: Racket =
{
  id: 2,
  name:		'racketDown',
  elem:		racketDown_elem,
  movement:	0,

  pos:		{ x: racketDown_elem.getBoundingClientRect().left,  y: racketDown_elem.getBoundingClientRect().top },
  size:		{ w: racketDown_elem.getBoundingClientRect().width, h: racketDown_elem.getBoundingClientRect().height },
  keys:		{ left: false, right: false }
}

// ---------------------- //
// Terrain Declarations : //
// ---------------------- //

interface Terrain extends GameObject
{
  pos:		Position;
  width:	number;
  height:	number;
}

let terrain: Terrain =
{
  id:		3,
  elem:		terrain_elem,

  pos:		{ x: terrain_elem.getBoundingClientRect().left, y: terrain_elem.getBoundingClientRect().top },
  width:	terrain_elem.getBoundingClientRect().width,
  height:	terrain_elem.getBoundingClientRect().height
}

// --------------------- //
// Others Declarations : //
// --------------------- //

let where =
{
  id:	4,
  name:	'ball_dir',
  elem:	where_elem,

  pos:	{ x: where_elem.getBoundingClientRect().left, y: where_elem.getBoundingClientRect().top },
}

// ----------------- //
// AI Declarations : //
// ----------------- //

interface AILevel
{
  id:			number;
  reactionTime:	number;
  errorMarging:	number;
}

const aiLevels =
{
  easy:
  {
    id:				5,
    reactionTime:	5,
    errorMarging:	150
  },

  normal:
  {
    id:				6,
    reactionTime:	5,
    errorMarging:	150
  },

  hard:
  {
    id:				7,
    reactionTime:	5,
    errorMarging:	150
  },

  impossible:
  {
    id:				8,
    reactionTime:	1,
    errorMarging:	0.0001
  }
} satisfies Record<string, AILevel>;
