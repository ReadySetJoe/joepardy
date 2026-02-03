"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BoardFromAPI,
  fetchBoards,
  createBoard,
  deleteBoard,
  fetchGames,
  deleteGame,
} from "../lib/api";
import { Game } from "../types";
import { AuthButton } from "../components/AuthButton";

export default function AdminPage() {
  const router = useRouter();
  const [boards, setBoards] = useState<BoardFromAPI[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"boards" | "games">("boards");

  const loadData = async () => {
    try {
      setError(null);
      const [boardsData, gamesData] = await Promise.all([
        fetchBoards(),
        fetchGames(),
      ]);
      setBoards(boardsData);
      setGames(gamesData);
    } catch (err) {
      setError("Failed to load data. Make sure the database is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async () => {
    if (!newBoardName.trim()) return;
    try {
      setError(null);
      await createBoard(newBoardName.trim());
      await loadData();
      setNewBoardName("");
      setIsCreating(false);
    } catch (err) {
      setError("Failed to create board");
      console.error(err);
    }
  };

  const handleDeleteBoard = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will also delete all games for this board. This cannot be undone.`)) return;
    try {
      setError(null);
      await deleteBoard(id);
      await loadData();
    } catch (err) {
      setError("Failed to delete board");
      console.error(err);
    }
  };

  const handleDeleteGame = async (id: string, name: string) => {
    if (!confirm(`Delete game "${name}"? This cannot be undone.`)) return;
    try {
      setError(null);
      await deleteGame(id);
      await loadData();
    } catch (err) {
      setError("Failed to delete game");
      console.error(err);
    }
  };

  const inProgressGames = games.filter((g) => g.status === "IN_PROGRESS");
  const completedGames = games.filter((g) => g.status === "COMPLETED");

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-slide-down">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-yellow-400/70 hover:text-yellow-400 text-sm uppercase tracking-widest transition-colors"
            >
              &larr; Back to Home
            </Link>
            <AuthButton />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-wide">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
              Admin
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your boards and games
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 animate-fade-in">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("boards")}
            className={`
              px-6 py-3 font-bold rounded-lg transition-all
              ${activeTab === "boards"
                ? "bg-gradient-to-b from-yellow-400 to-yellow-500 text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }
            `}
          >
            Boards ({boards.length})
          </button>
          <button
            onClick={() => setActiveTab("games")}
            className={`
              px-6 py-3 font-bold rounded-lg transition-all
              ${activeTab === "games"
                ? "bg-gradient-to-b from-yellow-400 to-yellow-500 text-black"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }
            `}
          >
            Games ({games.length})
          </button>
        </div>

        {/* Boards Tab */}
        {activeTab === "boards" && (
          <>
            {/* Create Board */}
            <div className="mb-8 animate-slide-up">
              {isCreating ? (
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newBoardName}
                    onChange={(e) => setNewBoardName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="Board name..."
                    autoFocus
                    className="
                      flex-1 px-4 py-3
                      bg-black/50 border-2 border-white/20
                      rounded-xl text-white placeholder-white/40
                      focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30
                      transition-all
                    "
                  />
                  <button
                    onClick={handleCreate}
                    className="
                      px-6 py-3
                      bg-gradient-to-b from-green-500 to-green-600
                      hover:from-green-400 hover:to-green-500
                      text-white font-bold rounded-xl
                      shadow-lg shadow-green-900/30
                      transition-all hover:scale-105 active:scale-95
                    "
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setNewBoardName("");
                    }}
                    className="
                      px-6 py-3
                      bg-gradient-to-b from-gray-600 to-gray-700
                      hover:from-gray-500 hover:to-gray-600
                      text-white font-bold rounded-xl
                      shadow-lg shadow-black/30
                      transition-all hover:scale-105 active:scale-95
                    "
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsCreating(true)}
                  className="
                    w-full py-4
                    bg-gradient-to-b from-yellow-400 to-yellow-500
                    hover:from-yellow-300 hover:to-yellow-400
                    text-black font-bold text-lg rounded-xl
                    shadow-lg shadow-yellow-500/30
                    transition-all hover:scale-[1.02] active:scale-[0.98]
                  "
                >
                  + Create New Board
                </button>
              )}
            </div>

            {/* Board List */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-16 animate-fade-in">
                  <p className="text-gray-500 text-lg">Loading...</p>
                </div>
              ) : boards.length === 0 ? (
                <div className="text-center py-16 animate-fade-in">
                  <p className="text-gray-500 text-lg">No boards yet</p>
                  <p className="text-gray-600 text-sm mt-1">
                    Create your first board to get started
                  </p>
                </div>
              ) : (
                boards.map((board, index) => {
                  const boardGames = games.filter((g) => g.boardId === board.id);
                  const activeGames = boardGames.filter((g) => g.status === "IN_PROGRESS").length;

                  return (
                    <div
                      key={board.id}
                      className="
                        relative overflow-hidden
                        bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
                        rounded-xl p-5
                        border border-white/10
                        shadow-lg shadow-black/30
                        opacity-0 animate-slide-up
                      "
                      style={{
                        animationDelay: `${index * 0.05}s`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {board.name}
                          </h2>
                          <p className="text-white/50 text-sm mt-1">
                            {board.categories.length} categories
                            {boardGames.length > 0 && (
                              <> &middot; {boardGames.length} game{boardGames.length !== 1 ? "s" : ""}</>
                            )}
                            {activeGames > 0 && (
                              <span className="text-green-400"> ({activeGames} active)</span>
                            )}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/play/${board.id}`}
                            className="
                              px-4 py-2
                              bg-green-500/20 hover:bg-green-500
                              text-green-400 hover:text-white
                              font-bold text-sm rounded-lg
                              transition-all hover:scale-105 active:scale-95
                            "
                          >
                            Play
                          </Link>
                          <Link
                            href={`/admin/${board.id}`}
                            className="
                              px-4 py-2
                              bg-white/10 hover:bg-white/20
                              text-white/70 hover:text-white
                              font-bold text-sm rounded-lg
                              transition-all hover:scale-105 active:scale-95
                            "
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteBoard(board.id, board.name)}
                            className="
                              px-4 py-2
                              bg-red-500/20 hover:bg-red-500
                              text-red-400 hover:text-white
                              font-bold text-sm rounded-lg
                              transition-all hover:scale-105 active:scale-95
                            "
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none" />
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Games Tab */}
        {activeTab === "games" && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-16 animate-fade-in">
                <p className="text-gray-500 text-lg">Loading...</p>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-16 animate-fade-in">
                <p className="text-gray-500 text-lg">No games yet</p>
                <p className="text-gray-600 text-sm mt-1">
                  Start a game from any board to see it here
                </p>
              </div>
            ) : (
              <>
                {/* In Progress Games */}
                {inProgressGames.length > 0 && (
                  <div>
                    <h2 className="text-white/70 text-sm uppercase tracking-widest mb-4">
                      In Progress ({inProgressGames.length})
                    </h2>
                    <div className="space-y-3">
                      {inProgressGames.map((game, index) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          index={index}
                          onDelete={() => handleDeleteGame(game.id, game.name || `Game ${game.id.slice(-6)}`)}
                          onResume={() => router.push(`/play/${game.boardId}/game/${game.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Completed Games */}
                {completedGames.length > 0 && (
                  <div>
                    <h2 className="text-white/70 text-sm uppercase tracking-widest mb-4">
                      Completed ({completedGames.length})
                    </h2>
                    <div className="space-y-3">
                      {completedGames.map((game, index) => (
                        <GameCard
                          key={game.id}
                          game={game}
                          index={index}
                          onDelete={() => handleDeleteGame(game.id, game.name || `Game ${game.id.slice(-6)}`)}
                          onResume={() => router.push(`/play/${game.boardId}/game/${game.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function GameCard({
  game,
  index,
  onDelete,
  onResume,
}: {
  game: Game;
  index: number;
  onDelete: () => void;
  onResume: () => void;
}) {
  const cluesAnswered = game.clueResults.length;
  const playersCount = game.players.length;
  const topPlayer = game.players.length > 0
    ? game.players.reduce((a, b) => (a.score > b.score ? a : b))
    : null;
  const isCompleted = game.status === "COMPLETED";

  return (
    <div
      className="
        relative overflow-hidden
        bg-gradient-to-r from-[#0a10d0]/50 to-[#060CE9]/50
        rounded-xl p-4
        border border-white/10
        shadow-lg shadow-black/30
        opacity-0 animate-slide-up
      "
      style={{
        animationDelay: `${index * 0.05}s`,
        animationFillMode: "forwards",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">
            {game.name || `Game ${game.id.slice(-6)}`}
          </h3>
          <p className="text-white/50 text-sm">
            Board: <span className="text-yellow-400/70">{game.board?.name || "Unknown"}</span>
          </p>
          <div className="flex gap-4 mt-1 text-sm text-white/50">
            <span>{playersCount} player{playersCount !== 1 ? "s" : ""}</span>
            <span>{cluesAnswered} clue{cluesAnswered !== 1 ? "s" : ""} answered</span>
          </div>
          {topPlayer && playersCount > 0 && (
            <p className="text-yellow-400/70 text-sm mt-1">
              {isCompleted ? "Winner" : "Leading"}: {topPlayer.name} (${topPlayer.score.toLocaleString()})
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isCompleted && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded uppercase tracking-wider">
              Active
            </span>
          )}
          <button
            onClick={onResume}
            className="
              px-4 py-2
              bg-green-500/20 hover:bg-green-500
              text-green-400 hover:text-white
              font-bold text-sm rounded-lg
              transition-all hover:scale-105 active:scale-95
            "
          >
            {isCompleted ? "View" : "Resume"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="
              px-4 py-2
              bg-red-500/20 hover:bg-red-500
              text-red-400 hover:text-white
              font-bold text-sm rounded-lg
              transition-all hover:scale-105 active:scale-95
            "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
