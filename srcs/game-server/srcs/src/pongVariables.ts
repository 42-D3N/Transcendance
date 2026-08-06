import type { Ball, GameRules, GameState, Player, AILevel } from "../../../website/srcs/src/lib/game/both/interfaces";

export function serverVariable()
{
  const GAME_WIDTH	= 650;
  const GAME_HEIGHT	= 730;
  const TICK_RATE = 60;
  const TICK_INTERVAL = 1000 / TICK_RATE;
  const DT = 1 / TICK_RATE;
  const BALL_BASE_POSITION =
  {
	x: (GAME_WIDTH / 2),
	y: (GAME_HEIGHT / 2)
  }
  const BALL_SIZE =
  {
	w: 15,
	h: 15
  } as const;

  let ball: Ball =
  {
	speed:	6,
	pos:	{ x: (GAME_WIDTH / 2), y: (GAME_HEIGHT / 2) },
	size:	BALL_SIZE,
	vel:	{ x: 0,  y: 0 }
  }

  let rules: GameRules = 
  {
	acceleration:	0.1,
	racketSpeed:	10,
	scoreToWin:		15,
	maxSpeed:		12,
	baseSpeed:		6
  }

  const state: GameState =
  {
	tick: 0,
	elapsedTime: 0,
	lastWinner: 1,
	status: "waiting",
	score: { p1: 0, p2: 0 }
  };

  const aiLevels =
  {
	easy:
	{
	  reactionTime:	500,
	  errorMargin:	150
	},

	normal:
	{
	  reactionTime:	250,
	  errorMargin:	150
	},

	hard:
	{
	  reactionTime:	100,
	  errorMargin:	150
	},

	impossible:
	{
	  reactionTime:	16,
	  errorMargin:	0.0001
	}
  } satisfies Record<string, AILevel>;

  const player1: Player =
  {
	input: { move: 0, special: false },
	racket:
	{
	  pos:	{ x: (GAME_WIDTH / 2), y: GAME_HEIGHT - 12.5 - 10 },
	  size:	{ w: 80, h: 10 },
	  vel:	{ x: 0, y: 0 }
	},
  };

  const player2: Player =
  {
	input: { move: 0, special: false },
	racket:
	{
	  pos:	{ x: (GAME_WIDTH / 2), y: 12.5 },
	  size:	{ w: 80, h: 10 },
	  vel:	{ x: 0, y: 0 }
	},
	ai: { level: aiLevels.easy, lastDecisionTime: 0 }
  };

  return {
	GAME_WIDTH,
	GAME_HEIGHT,
	BALL_BASE_POSITION,
	TICK_INTERVAL,
	DT,
	ball,
	player1,
	player2,
	state,
	rules
  };
}
