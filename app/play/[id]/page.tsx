"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BoardFromAPI, fetchBoard, fetchGames, createGame, deleteGame } from "../../lib/api";
import { Game } from "../../types";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PlayBoardPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [board, setBoard] = useState<BoardFromAPI | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [gameName, setGameName] = useState("");
  const [showNewGameForm, setShowNewGameForm] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedBoard, loadedGames] = await Promise.all([
          fetchBoard(id),
          fetchGames(id),
        ]);

        if (!loadedBoard) {
          router.push("/admin");
          return;
        }

        setBoard(loadedBoard);
        setGames(loadedGames);
      } catch (err) {
        setError("Failed to load board");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, router]);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const game = await createGame(id, gameName || undefined);
      router.push(`/play/${id}/game/${game.id}`);
    } catch (err) {
      console.error("Failed to create game:", err);
      setCreating(false);
    }
  };

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm("Are you sure you want to delete this game?")) return;
    try {
      await deleteGame(gameId);
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (err) {
      console.error("Failed to delete game:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/admin" className="text-yellow-400 hover:underline">
            Back to Admin
          </Link>
        </div>
      </main>
    );
  }

  if (!board) {
    return null;
  }

  const inProgressGames = games.filter((g) => g.status === "IN_PROGRESS");
  const completedGames = games.filter((g) => g.status === "COMPLETED");

  return (
    <main className="min-h-screen py-8">
      <header className="text-center mb-8 animate-slide-down">
        <Link
          href="/admin"
          className="text-yellow-400/70 hover:text-yellow-400 text-sm uppercase tracking-widest transition-colors"
        >
          &larr; Back to Admin
        </Link>
        <h1 className="text-4xl md:text-6xl font-black text-white mt-4 tracking-wider">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
            {board.name}
          </span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm tracking-widest uppercase">
          Select a game to continue or start a new one
        </p>
      </header>

      <div className="max-w-2xl mx-auto px-4">
        {/* New Game Section */}
        <div className="mb-8">
          {showNewGameForm ? (
            <form onSubmit={handleCreateGame} className="bg-[#0a10d0]/30 rounded-lg p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-white mb-4">Start New Game</h2>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Game name (optional)"
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400/50 mb-4"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors disabled:opacity-50"
                >
                  {creating ? "Starting..." : "Start Game"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewGameForm(false);
                    setGameName("");
                  }}
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowNewGameForm(true)}
              className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-colors text-lg shadow-lg shadow-yellow-500/20"
            >
              + Start New Game
            </button>
          )}
        </div>

        {/* In Progress Games */}
        {inProgressGames.length > 0 && (
          <div className="mb-8 animate-slide-up">
            <h2 className="text-white/70 text-sm uppercase tracking-widest mb-4">
              In Progress ({inProgressGames.length})
            </h2>
            <div className="space-y-3">
              {inProgressGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  boardId={id}
                  onDelete={() => handleDeleteGame(game.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Games */}
        {completedGames.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-white/70 text-sm uppercase tracking-widest mb-4">
              Completed ({completedGames.length})
            </h2>
            <div className="space-y-3">
              {completedGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  boardId={id}
                  onDelete={() => handleDeleteGame(game.id)}
                />
              ))}
            </div>
          </div>
        )}

        {games.length === 0 && (
          <p className="text-center text-white/30 py-8">
            No games yet. Start a new game to begin playing!
          </p>
        )}
      </div>
    </main>
  );
}

function GameCard({
  game,
  boardId,
  onDelete,
}: {
  game: Game;
  boardId: string;
  onDelete: () => void;
}) {
  const router = useRouter();
  const cluesAnswered = game.clueResults.length;
  const playersCount = game.players.length;
  const topPlayer = game.players.length > 0
    ? game.players.reduce((a, b) => (a.score > b.score ? a : b))
    : null;

  return (
    <div
      onClick={() => router.push(`/play/${boardId}/game/${game.id}`)}
      className="bg-gradient-to-r from-[#0a10d0]/50 to-[#060CE9]/50 rounded-lg p-4 cursor-pointer hover:from-[#0a10d0]/70 hover:to-[#060CE9]/70 transition-all hover:scale-[1.02] border border-white/10 hover:border-yellow-400/30"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-bold text-lg">
            {game.name || `Game ${game.id.slice(-6)}`}
          </h3>
          <div className="flex gap-4 mt-1 text-sm text-white/50">
            <span>{playersCount} player{playersCount !== 1 ? "s" : ""}</span>
            <span>{cluesAnswered} clue{cluesAnswered !== 1 ? "s" : ""} answered</span>
          </div>
          {topPlayer && playersCount > 0 && (
            <p className="text-yellow-400/70 text-sm mt-1">
              Leading: {topPlayer.name} (${topPlayer.score.toLocaleString()})
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {game.status === "IN_PROGRESS" && (
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded uppercase tracking-wider">
              Active
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-white/30 hover:text-red-400 transition-colors p-2"
            title="Delete game"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
