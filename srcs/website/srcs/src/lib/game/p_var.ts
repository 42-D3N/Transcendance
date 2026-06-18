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

  const terrainRect = terrain_elem.getBoundingClientRect();

  const racketUpRect = racketUp_elem.getBoundingClientRect();
  const racketDownRect = racketDown_elem.getBoundingClientRect();
  const ballRect = ball_elem.getBoundingClientRect();
  const whereRect = where_elem.getBoundingClientRect();

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

    base_pos:	{ x: ballRect.left - (terrainRect.left / 2), y:  ballRect.top - (terrainRect.top / 2) },
    pos:		{ x: ballRect.left - (terrainRect.left / 2), y:  ballRect.top - (terrainRect.top / 2) },
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

    pos:		{ x: racketUpRect.left - (terrainRect.left / 2),  y: racketUpRect.top - (terrainRect.top / 2) },
    size:		{ w: 80, h: 10 },
    keys:		{ left: false, right: false }
  }

  let racketDown: Racket =
  {
    id: 		2,
    name:		'racketDown',
    elem:		racketDown_elem,
    movement:	0,

    pos:		{ x: racketDownRect.left - (terrainRect.left / 2),  y: racketDownRect.top - (terrainRect.top / 2) },
    size:		{ w: 80, h: 10 },
    keys:		{ left: false, right: false }
  }
/*
┌────────────────────┐
│Terrain Declarations│
└────────────────────┘
*/
  interface Terrain extends GameObject
  {
    pos:	Position;
    width:	number;
    height:	number;
  }

  let terrain: Terrain =
  {
    id:		3,
    elem:	terrain_elem,

    pos:	{ x: (terrainRect.left / 2), y: (terrainRect.top / 2) },
    width:	GAME_WIDTH,
    height:	GAME_HEIGHT
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

    pos:	{ x: whereRect.left - (terrainRect.left / 2), y: whereRect.top - (terrainRect.top / 2) },
  }

  const scale = { x: 1, y: 1 };
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
    aiLevels,
    timeoutID: undefined,
    animationFrameID: 0,
    close_game: false
};
}
