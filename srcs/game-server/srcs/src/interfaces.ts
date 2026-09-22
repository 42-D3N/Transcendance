export interface Score
{
  p1: number;
  p2: number;
}

export interface Size
{
  w: number;
  h: number;
}
export interface Position
{
  x: number;
  y: number;
}

export interface Velocity
{
  x: number;
  y: number;
}

export interface GameRules
{
  acceleration:	number,
  racketSpeed:	number,
  scoreToWin:	number,
  baseSpeed:	number,
  maxSpeed:		number
}

export interface Ball
{
  pos:		Position;
  vel:		Velocity;
  speed:	number;
  size:		Size;
}

export interface Racket
{
  pos:	Position;
  size:	Size;
  vel:	Velocity;
}

export type GameStatus =
  | "waiting"
  | "ready_check"
  | "countdown"
  | "playing"
  | "round_end"
  | "game_end";

export interface ReadyState
{
  p1: boolean;
  p2: boolean;
}

export interface GameState
{
  status:		GameStatus;
  elapsedTime:	number;
  lastWinner:	1 | 2;
  score:		Score;
  tick:			number;
}

export interface AILevel
{
  reactionTime:		number;
  errorMargin:		number;
}

export type MatchMode = "pvp" | "pve";
export type AIDifficulty = "easy" | "normal" | "hard" | "impossible";

export interface AI
{
  level: AILevel;
  lastDecisionTime: number;
  targetX: number | null;
}

export interface PlayerInput
{
  move: -1 | 0 | 1;
}

export interface Player
{
  input: PlayerInput;
  racket: Racket;
  ai?: AI;
}

export interface ClientGameState
{
  score:	Score;
  ball:		Position;
  prediction: { start: Position; end: Position } | null;
  player1:	{ racket: Position; };
  player2:	{ racket: Position; };
  status:	GameStatus;
  ready: ReadyState;
  countdown: number | null;
}

export interface ClientInputMessage
{
  type: "input";
  input: PlayerInput;
}

export interface ClientPingMessage
{
  type: "ping";
}

export interface ClientReadyMessage
{
  type: "ready";
}

export interface ConnectedPlayer
{
  socket: WebSocket;
  player: Player;
}

export type ClientMessage =
  | ClientInputMessage
  | ClientPingMessage
  | ClientReadyMessage;


export interface ServerGameStateMessage
{
  type: "gameState";
  state: ClientGameState;
}

export interface ServerPongMessage
{
  type: "pong";
}

export interface ServerPlayerAssignedMessage
{
  type: "playerAssigned";
  side: 1 | 2;
  instanceId?: string;
  opponentUsername?: string | null;
  opponentSkinRac?: number | string | null;
}

export interface ServerErrorMessage
{
  type: "error";
  message: string;
}

export type ServerMessage =
  | ServerGameStateMessage
  | ServerPongMessage
  | ServerPlayerAssignedMessage
  | ServerErrorMessage;
