import { GameBoard, Game, GamePlayer, ClueAnswer } from "../types";

export interface BoardFromAPI {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  categories: CategoryFromAPI[];
}

export interface CategoryFromAPI {
  id: string;
  name: string;
  order: number;
  boardId: string;
  clues: ClueFromAPI[];
}

export interface ClueFromAPI {
  id: string;
  value: number;
  question: string;
  answer: string;
  order: number;
  categoryId: string;
}

// Convert API response to GameBoard format for playing (preserves clue IDs)
export function toGameBoard(board: BoardFromAPI): GameBoard {
  return {
    categories: board.categories.map((cat) => ({
      name: cat.name,
      clues: cat.clues.map((clue) => ({
        id: clue.id,
        value: clue.value,
        question: clue.question,
        answer: clue.answer,
      })),
    })),
  };
}

// Fetch all boards
export async function fetchBoards(): Promise<BoardFromAPI[]> {
  const response = await fetch("/api/boards");
  if (!response.ok) {
    throw new Error("Failed to fetch boards");
  }
  return response.json();
}

// Fetch a single board
export async function fetchBoard(id: string): Promise<BoardFromAPI | null> {
  const response = await fetch(`/api/boards/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch board");
  }
  return response.json();
}

// Create a new board
export async function createBoard(name: string): Promise<BoardFromAPI> {
  const response = await fetch("/api/boards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to create board");
  }
  return response.json();
}

// Update a board
export async function updateBoard(
  id: string,
  data: { name: string; categories: CategoryFromAPI[] }
): Promise<BoardFromAPI> {
  const response = await fetch(`/api/boards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update board");
  }
  return response.json();
}

// Delete a board
export async function deleteBoard(id: string): Promise<void> {
  const response = await fetch(`/api/boards/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete board");
  }
}

// ============ Game API Functions ============

// Fetch all games (optionally filtered by boardId and/or status)
export async function fetchGames(boardId?: string, status?: "IN_PROGRESS" | "COMPLETED"): Promise<Game[]> {
  const params = new URLSearchParams();
  if (boardId) params.set("boardId", boardId);
  if (status) params.set("status", status);

  const query = params.toString();
  const response = await fetch(`/api/games${query ? `?${query}` : ""}`);
  if (!response.ok) {
    throw new Error("Failed to fetch games");
  }
  return response.json();
}

// Fetch a single game
export async function fetchGame(id: string): Promise<Game | null> {
  const response = await fetch(`/api/games/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch game");
  }
  return response.json();
}

// Create a new game
export async function createGame(boardId: string, name?: string, players?: string[]): Promise<Game> {
  const response = await fetch("/api/games", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ boardId, name, players }),
  });
  if (!response.ok) {
    throw new Error("Failed to create game");
  }
  return response.json();
}

// Update a game (name, status)
export async function updateGame(id: string, data: { name?: string; status?: "IN_PROGRESS" | "COMPLETED" }): Promise<Game> {
  const response = await fetch(`/api/games/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update game");
  }
  return response.json();
}

// Delete a game
export async function deleteGame(id: string): Promise<void> {
  const response = await fetch(`/api/games/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete game");
  }
}

// Add a player to a game
export async function addPlayer(gameId: string, name: string): Promise<GamePlayer> {
  const response = await fetch(`/api/games/${gameId}/players`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error("Failed to add player");
  }
  return response.json();
}

// Update player scores (batch)
export async function updatePlayerScores(gameId: string, players: { id: string; score: number }[]): Promise<GamePlayer[]> {
  const response = await fetch(`/api/games/${gameId}/players`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ players }),
  });
  if (!response.ok) {
    throw new Error("Failed to update player scores");
  }
  return response.json();
}

// Record clue result(s)
export async function recordClueResult(
  gameId: string,
  clueId: string,
  results: { playerId: string | null; result: ClueAnswer; scoreChange: number }[]
): Promise<Game> {
  const response = await fetch(`/api/games/${gameId}/clues/${clueId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ results }),
  });
  if (!response.ok) {
    throw new Error("Failed to record clue result");
  }
  return response.json();
}

// Remove clue result (reactivate a clue)
export async function removeClueResult(gameId: string, clueId: string): Promise<Game> {
  const response = await fetch(`/api/games/${gameId}/clues/${clueId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to remove clue result");
  }
  return response.json();
}
