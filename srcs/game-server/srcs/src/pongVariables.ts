import type { Ball, GameRules, GameState, Player, AILevel } from "../../../website/srcs/src/lib/game/both/interfaces";

export function serverVariable()
{
  const GAME_WIDTH    = 650;
  const GAME_HEIGHT    = 730;
  const TICK_RATE = 60;
  const TICK_INTERVAL = 1000 / TICK_RATE;
  const DT = 1 / TICK_RATE;
  const ROUND_PAUSE_TICKS = TICK_RATE * 2;
  const POWER_PAUSE_TICKS = Math.round(TICK_RATE / 2);
  const POWER_TRIGGER_LINE_Y = GAME_HEIGHT / 2;
  const POWER_MAX_USES = 3;
  const POWER_SPEED_MULTIPLIER = 2;
  const POWER_DIRECTION_VARIATION = 0.15;
  const BALL_SIZE = { w: 15, h: 15 } as const;
  const BALL_BASE_POSITION = {
    x: (GAME_WIDTH - BALL_SIZE.w) / 2,
    y: (GAME_HEIGHT - BALL_SIZE.h) / 2
  };

  let ball: Ball =
  {
    speed:	360,
    pos:	{ x: BALL_BASE_POSITION.x, y: BALL_BASE_POSITION.y },
    size:	BALL_SIZE,
    vel:	{ x: 50.5,  y: 50.5 }
  }

  let rules: GameRules = 
  {
    acceleration:	6,
    racketSpeed:	600,
    scoreToWin:		15,
    maxSpeed:		720,
    baseSpeed:		360
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

  const power =
  {
    pendingOwner: null as 1 | 2 | null,
    pauseUntilTick: 0,
    boostedTarget: null as 1 | 2 | null,
    baseSpeedBeforeBoost: null as number | null,
    remainingUses: { p1: POWER_MAX_USES, p2: POWER_MAX_USES },
    specialLatch: { p1: false, p2: false }
  };

  return {
    GAME_WIDTH,
    GAME_HEIGHT,
    BALL_BASE_POSITION,
    TICK_INTERVAL,
    DT,
    ROUND_PAUSE_TICKS,
    POWER_PAUSE_TICKS,
    POWER_TRIGGER_LINE_Y,
    POWER_SPEED_MULTIPLIER,
    POWER_DIRECTION_VARIATION,
    roundEndTick: 0,
    ball,
    player1,
    player2,
    state,
    rules,
    power
  };
}
