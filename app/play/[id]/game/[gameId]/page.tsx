"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BoardFromAPI,
  fetchBoard,
  fetchGame,
  toGameBoard,
  addPlayer,
  recordClueResult,
  updateGame,
  updatePlayerScores,
} from "../../../../lib/api";
import { Game, GamePlayer, ClueAnswer } from "../../../../types";
import { GameBoard } from "../../../../components/GameBoard";

interface PageProps {
  params: Promise<{ id: string; gameId: string }>;
}

export default function PlayGamePage({ params }: PageProps) {
  const { id: boardId, gameId } = use(params);
  const router = useRouter();
  const [board, setBoard] = useState<BoardFromAPI | null>(null);
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [loadedBoard, loadedGame] = await Promise.all([
          fetchBoard(boardId),
          fetchGame(gameId),
        ]);

        if (!loadedBoard) {
          router.push("/admin");
          return;
        }

        if (!loadedGame) {
          router.push(`/play/${boardId}`);
          return;
        }

        setBoard(loadedBoard);
        setGame(loadedGame);
      } catch (err) {
        setError("Failed to load game");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [boardId, gameId, router]);

  const handleAddPlayer = async (name: string): Promise<GamePlayer> => {
    const player = await addPlayer(gameId, name);
    setGame((prev) =>
      prev ? { ...prev, players: [...prev.players, player] } : prev
    );
    return player;
  };

  const handleClueResult = async (
    clueId: string,
    results: { playerId: string | null; result: ClueAnswer; scoreChange: number }[]
  ): Promise<void> => {
    const updatedGame = await recordClueResult(gameId, clueId, results);
    setGame(updatedGame);
  };

  const handleUpdateScore = async (playerId: string, newScore: number): Promise<void> => {
    const updatedPlayers = await updatePlayerScores(gameId, [{ id: playerId, score: newScore }]);
    setGame((prev) =>
      prev ? { ...prev, players: updatedPlayers.map(p => ({ ...p, order: p.order })) } : prev
    );
  };

  const handleEndGame = async () => {
    if (!confirm("Are you sure you want to end this game?")) return;
    setEnding(true);
    try {
      await updateGame(gameId, { status: "COMPLETED" });
      router.push(`/play/${boardId}`);
    } catch (err) {
      console.error("Failed to end game:", err);
      setEnding(false);
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

  if (!board || !game) {
    return null;
  }

  const isCompleted = game.status === "COMPLETED";

  return (
    <main className="min-h-screen py-8">
      <header className="text-center mb-8 animate-slide-down">
        <div className="flex items-center justify-center gap-4">
          <Link
            href={`/play/${boardId}`}
            className="text-yellow-400/70 hover:text-yellow-400 text-sm uppercase tracking-widest transition-colors"
          >
            &larr; Back to Games
          </Link>
          {!isCompleted && (
            <>
              <span className="text-white/20">|</span>
              <button
                onClick={handleEndGame}
                disabled={ending}
                className="text-red-400/70 hover:text-red-400 text-sm uppercase tracking-widest transition-colors disabled:opacity-50"
              >
                {ending ? "Ending..." : "End Game"}
              </button>
            </>
          )}
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white mt-4 tracking-wider">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
            {board.name}
          </span>
        </h1>
        {isCompleted && (
          <span className="inline-block mt-2 px-3 py-1 bg-white/10 text-white/70 text-sm rounded-full uppercase tracking-wider">
            Game Completed
          </span>
        )}
      </header>

      <GameBoard
        board={toGameBoard(board)}
        game={game}
        onAddPlayer={handleAddPlayer}
        onClueResult={handleClueResult}
        onUpdateScore={handleUpdateScore}
        readOnly={isCompleted}
      />
    </main>
  );
}
