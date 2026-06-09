// ----------------------- //
// Elements Declarations : //
// ----------------------- //

export function initGame()
{
  const terrain_elem	= document.getElementById("background")	as HTMLElement;
  const racketDown_elem	= document.getElementById("racketDown")	as HTMLElement;
  const racketUp_elem	= document.getElementById("racketUp")	as HTMLElement;
  const where_elem		= document.getElementById("where")		as HTMLElement;
  const ball_elem		= document.getElementById("circle")		as HTMLElement;
  if (!terrain_elem || !racketDown_elem || !racketUp_elem || !ball_elem || !where_elem)
    throw new Error("Pong element init not found. Please check HTML or ID");

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
  return {
    terrain_elem,
    racketDown_elem,
    racketUp_elem,
    where_elem,
    ball_elem,
    ball,
    racketUp,
    racketDown,
    terrain,
    where};
}
// ------------------------ //
// Gamerules Declarations : //
// ------------------------ //

export const acceleration	= 0.1;
export const racket_speed	= 10;
export const score_to_win	= 15;
export const maxSpeed		= 12;
export const baseSpeed		= 6;

// ------------------- //
// Misc Declarations : //
// ------------------- //

export interface GameState
{
    len:			number;
    time:			number;
    last_win:		number;
    end_round:		boolean;
    use_powerup:	boolean;
    end_game:		boolean;
    running:		boolean;
    restart:		boolean;
    up:				boolean;
	score: { p1: number; p2: number; };
}

export const state: GameState =
{
    len:			0,
    time:			0,
    last_win:		1,
    end_round:		false,
    use_powerup:	false,
    end_game:		false,
    running:		false,
    restart:		false,
    up:				true,
    score:			{ p1: 0, p2: 0 }
};

// ----------------- //
// AI Declarations : //
// ----------------- //

interface AILevel
{
  id:			number;
  reactionTime:	number;
  errorMarging:	number;
}

export const aiLevels =
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
