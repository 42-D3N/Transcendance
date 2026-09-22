import type { Ball, GameRules, GameState, Player, AILevel } from "../../../website/srcs/src/lib/game/both/interfaces";

export type MatchMode = "pvp" | "pve";
export type AIDifficulty = "easy" | "normal" | "hard" | "impossible";

export interface MatchConfig
{
  mode: MatchMode;
  aiDifficulty?: AIDifficulty;
}

export function serverVariable(config: MatchConfig)
{
  const GAME_WIDTH = 650;
  const GAME_HEIGHT = 730;
  const TICK_RATE = 60;
  const TICK_INTERVAL = 1000 / TICK_RATE;
  const DT = 1 / TICK_RATE;
  const ROUND_PAUSE_TICKS = TICK_RATE * 2;
  const MATCH_START_COUNTDOWN_TICKS = TICK_RATE * 3;
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
    scoreToWin:		3,
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
      reactionTime:	780,
      errorMargin:	230
    },

    normal:
    {
      reactionTime:	780,
      errorMargin:	200
    },

    hard:
    {
      reactionTime:	300,
      errorMargin:	150
    },

    impossible:
    {
      reactionTime:	1,
      errorMargin:	1
    }
  } satisfies Record<string, AILevel>;

  const player1: Player =
  {
    input: { move: 0 },
    racket:
    {
      pos:	{ x: (GAME_WIDTH / 2), y: GAME_HEIGHT - 12.5 - 10 },
      size:	{ w: 80, h: 10 },
      vel:	{ x: 0, y: 0 }
    },
  };

  const player2: Player =
  {
    input: { move: 0 },
    racket:
    {
      pos:	{ x: (GAME_WIDTH / 2), y: 12.5 },
      size:	{ w: 80, h: 10 },
      vel:	{ x: 0, y: 0 }
    },
    ai: {
      level: aiLevels[config.aiDifficulty ?? "easy"],
      lastDecisionTime: 0,
      targetX: null
    }
  };

  const ready =
  {
    p1: false,
    p2: config.mode === "pve"
  };

  const playerUserIds = {
    p1: null as string | null,
    p2: null as string | null
  };

  const playerUserData = {
    p1: null as { id: number | string; username: string; wins: number; losses: number; matches: number; wallet: number; icon?: string | null; skin_rac?: number | null; skin_ball?: number | null } | null,
    p2: null as { id: number | string; username: string; wins: number; losses: number; matches: number; wallet: number; icon?: string | null; skin_rac?: number | null; skin_ball?: number | null } | null
  };

  const player2WasHuman = false;

  return {
    GAME_WIDTH,
    GAME_HEIGHT,
    BALL_BASE_POSITION,
    TICK_RATE,
    TICK_INTERVAL,
    DT,
    ROUND_PAUSE_TICKS,
    MATCH_START_COUNTDOWN_TICKS,
    roundEndTick: 0,
    countdownEndTick: 0,
    countdownLaunchVelocity: null as { x: number; y: number } | null,
    waitingForReconnect: false,
    waitingForReconnectSide: null as 1 | 2 | null,
    waitingForReconnectUntilTick: 0,
    ball,
    player1,
    player2,
    state,
    rules,
    ready,
    playerUserIds,
    playerUserData,
    player2WasHuman,
    mode: config.mode
  };
}
