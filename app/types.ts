export interface Clue {
  id?: string;
  question: string;
  answer: string;
  value: number;
}

export interface Category {
  name: string;
  clues: Clue[];
}

export interface GameBoard {
  categories: Category[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
}

// Game session types
export type GameStatus = "IN_PROGRESS" | "COMPLETED";
export type ClueAnswer = "CORRECT" | "INCORRECT" | "SKIPPED";

export interface GamePlayer {
  id: string;
  name: string;
  score: number;
  order: number;
}

export interface ClueResult {
  id: string;
  clueId: string;
  playerId: string | null;
  result: ClueAnswer;
}

export interface Game {
  id: string;
  name: string | null;
  status: GameStatus;
  boardId: string;
  createdAt: string;
  updatedAt: string;
  players: GamePlayer[];
  clueResults: ClueResult[];
}
