export function initGame()
{
/*
┌─────────────────────┐
│Elements Declarations│
└─────────────────────┘
*/
  const terrain_elem	= document.getElementById("background")	as HTMLElement;
  const racketDown_elem	= document.getElementById("racketDown")	as HTMLElement;
  const racketUp_elem	= document.getElementById("racketUp")	as HTMLElement;
  const where_elem		= document.getElementById("where")		as HTMLElement;
  const ball_elem		= document.getElementById("circle")		as HTMLElement;
  if (!terrain_elem || !racketDown_elem || !racketUp_elem || !ball_elem || !where_elem)
    throw new Error("Pong element init not found. Please check HTML or ID");

  const GAME_WIDTH	= 650;
  const GAME_HEIGHT	= 730;
/*
┌───────────────────────────┐
│MISC Interface Declarations│
└───────────────────────────┘
*/
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
/*
┌────────────────────┐
│Terrain Declarations│
└────────────────────┘
*/
  interface Terrain extends GameObject
  {
    width:	number;
    height:	number;
  }

  let terrain: Terrain =
  {
    id:		3,
    elem:	terrain_elem,

    width:	GAME_WIDTH,
    height:	GAME_HEIGHT
  }
/*
┌─────────────────┐
│Ball Declarations│
└─────────────────┘
*/
  interface Ball extends GameObject
  {
    name:		string;
    speed:		number;
    tmp_speed:	number;

    base_pos:	Position;
    pos:		Position;
    size:		Size;
    vel:		Velocity;
  }

  let ball: Ball =
  {
    id:			0,
    name:		"ball",
    speed:		6,
    tmp_speed:	0,
    elem:		ball_elem,

    base_pos:	{ x: (terrain.width / 2), y:  (terrain.height / 2) },
    pos:		{ x: (terrain.width / 2), y:  (terrain.height / 2) },
    size:		{ w: 15, h: 15 },
    vel:		{ x: 0,  y: 0 }
  }
/*
┌────────────────────┐
│Rackets Declarations│
└────────────────────┘
*/
  interface Racket extends GameObject
  {
    name:		string;
    pos:		Position;
    size:		Size;
    movement:	number;

    keys:
    {
      left:		boolean;
      right:	boolean;
    };
  }

  let racketUp: Racket =
  {
    id: 		1,
    name:		'racketUp',
    elem:		racketUp_elem,
    movement:	0,

    pos:		{ x: (terrain.width / 2),  y: 12.5 },
    size:		{ w: 80, h: 10 },
    keys:		{ left: false, right: false }
  }

  let racketDown: Racket =
  {
    id: 		2,
    name:		'racketDown',
    elem:		racketDown_elem,
    movement:	0,

    pos:		{ x: (terrain.width / 2),  y: 722.5 - 12.5 },
    size:		{ w: 80, h: 10 },
    keys:		{ left: false, right: false }
  }
/*
┌───────────────────┐
│Others Declarations│
└───────────────────┘
*/
  let where =
  {
    id:		4,
    name:	'ball_dir',
    elem:	where_elem,

    pos:	{ x: 0, y: 0 },
    size:	{ w: 200, h: 5 },
  }

  const scale = { x: 1, y: 1 };

  let onKeyDown;
  let onKeyUp;
  let onResize;
/*
┌──────────────────────┐
│Gamerules Declarations│
└──────────────────────┘
*/
  const acceleration	= 0.1;
  const racket_speed	= 10;
  const score_to_win	= 15;
  const maxSpeed		= 12;
  const baseSpeed		= 6;
/*
┌─────────────────┐
│Misc Declarations│
└─────────────────┘
*/
  interface GameState
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

  const state: GameState =
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
/*
┌───────────────┐
│AI Declarations│
└───────────────┘
*/
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
      id:			5,
      reactionTime:	5,
      errorMarging:	150
    },

    normal:
    {
      id:			6,
      reactionTime:	5,
      errorMarging:	150
    },

    hard:
    {
      id:			7,
      reactionTime:	5,
      errorMarging:	150
    },

    impossible:
    {
      id:			8,
      reactionTime:	1,
      errorMarging:	0.0001
    }
  } satisfies Record<string, AILevel>;

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
    where,
    scale,
    state,
    acceleration,
    racket_speed,
    score_to_win,
    maxSpeed,
    baseSpeed,
    onKeyDown,
    onKeyUp,
    onResize,
    aiLevels,
    timeoutID: undefined,
    animationFrameID: 0,
    close_game: false,
};
}
