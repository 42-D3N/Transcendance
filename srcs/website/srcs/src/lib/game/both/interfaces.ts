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
  | "playing"
  | "round_end"
  | "game_end";

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

export interface AI
{
  level: AILevel;
  lastDecisionTime: number;
}

export interface PlayerInput
{
  move: -1 | 0 | 1;
  special: boolean;
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
  player1:	{ racket: Position; };
  player2:	{ racket: Position; };
  status:	GameStatus
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

export interface ConnectedPlayer
{
  socket: WebSocket;
  player: Player;
}

export type ClientMessage =
  | ClientInputMessage
  | ClientPingMessage;


export interface ServerGameStateMessage
{
  type: "gameState";
  state: ClientGameState;
}

export interface ServerPongMessage
{
  type: "pong";
}

export interface ServerErrorMessage
{
  type: "error";
  message: string;
}

export type ServerMessage =
  | ServerGameStateMessage
  | ServerPongMessage
  | ServerErrorMessage;
