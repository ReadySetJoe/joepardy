"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BoardFromAPI,
  fetchBoards,
  createBoard,
  deleteBoard,
} from "../lib/api";

export default function AdminPage() {
  const [boards, setBoards] = useState<BoardFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadBoards = async () => {
    try {
      setError(null);
      const data = await fetchBoards();
      setBoards(data);
    } catch (err) {
      setError("Failed to load boards. Make sure the database is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreate = async () => {
    if (!newBoardName.trim()) return;
    try {
      setError(null);
      await createBoard(newBoardName.trim());
      await loadBoards();
      setNewBoardName("");
      setIsCreating(false);
    } catch (err) {
      setError("Failed to create board");
      console.error(err);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      setError(null);
      await deleteBoard(id);
      await loadBoards();
    } catch (err) {
      setError("Failed to delete board");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-slide-down">
          <Link
            href="/"
            className="text-yellow-400/70 hover:text-yellow-400 text-sm uppercase tracking-widest transition-colors"
          >
            &larr; Back to Game
          </Link>
          <h1 className="text-4xl md:text-5xl font-black text-white mt-4 tracking-wide">
            Board{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
              Manager
            </span>
          </h1>
          <p className="text-gray-500 mt-2">
            Create and manage your Joe-pardy boards
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 animate-fade-in">
            {error}
          </div>
        )}

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
              <p className="text-gray-500 text-lg">Loading boards...</p>
            </div>
          ) : boards.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <p className="text-gray-500 text-lg">No boards yet</p>
              <p className="text-gray-600 text-sm mt-1">
                Create your first board to get started
              </p>
            </div>
          ) : (
            boards.map((board, index) => (
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
                      {board.categories.length} categories &middot; Updated{" "}
                      {new Date(board.updatedAt).toLocaleDateString()}
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
                      onClick={() => handleDelete(board.id, board.name)}
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
            ))
          )}
        </div>
      </div>
    </main>
  );
}
