"use client";

import { useState } from "react";
import { Player } from "../types";

interface PlayerPanelProps {
  players: Player[];
  onAddPlayer: (name: string) => void;
  onUpdateScore: (playerId: string, newScore: number) => void;
  readOnly?: boolean;
}

export function PlayerPanel({ players, onAddPlayer, onUpdateScore, readOnly = false }: PlayerPanelProps) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayerName.trim()) {
      onAddPlayer(newPlayerName.trim());
      setNewPlayerName("");
      setIsAdding(false);
    }
  };

  const handleScoreChange = (playerId: string, value: string) => {
    const newScore = parseInt(value, 10);
    if (!isNaN(newScore)) {
      onUpdateScore(playerId, newScore);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 mb-6">
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className="
              relative overflow-hidden
              flex flex-col items-center
              px-5 py-3 md:px-6 md:py-4
              rounded-xl
              bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
              shadow-lg shadow-black/30
              border border-white/10
              opacity-0 animate-scale-in
              transition-transform duration-200 hover:scale-105
            "
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <span className="font-bold text-base md:text-lg text-white/90 tracking-wide">
              {player.name}
            </span>
            {readOnly ? (
              <span
                className={`
                  text-2xl md:text-3xl font-black mt-1
                  ${player.score < 0
                    ? "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                    : "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 drop-shadow-lg"
                  }
                `}
              >
                ${player.score.toLocaleString()}
              </span>
            ) : (
              <div className="flex items-center mt-1">
                <span className={`
                  text-2xl md:text-3xl font-black
                  ${player.score < 0
                    ? "text-red-400"
                    : "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500"
                  }
                `}>
                  $
                </span>
                <input
                  type="number"
                  value={player.score}
                  onChange={(e) => handleScoreChange(player.id, e.target.value)}
                  className={`
                    w-24 md:w-28
                    text-2xl md:text-3xl font-black text-center
                    bg-transparent border-none outline-none
                    ${player.score < 0
                      ? "text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]"
                      : "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 drop-shadow-lg"
                    }
                    [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  `}
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none" />
          </div>
        ))}

        {!readOnly && (
          isAdding ? (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 animate-scale-in"
            >
              <input
                type="text"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                placeholder="Player name"
                autoFocus
                className="
                  px-4 py-3
                  rounded-xl
                  bg-black/50
                  border-2 border-white/20
                  text-white
                  placeholder-white/40
                  focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/30
                  transition-all duration-200
                "
              />
              <button
                type="submit"
                className="
                  px-4 py-3
                  bg-gradient-to-b from-green-500 to-green-600
                  hover:from-green-400 hover:to-green-500
                  text-white font-bold
                  rounded-xl
                  shadow-lg shadow-green-900/30
                  transition-all duration-200 hover:scale-105 active:scale-95
                "
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewPlayerName("");
                }}
                className="
                  px-4 py-3
                  bg-gradient-to-b from-gray-600 to-gray-700
                  hover:from-gray-500 hover:to-gray-600
                  text-white font-bold
                  rounded-xl
                  shadow-lg shadow-black/30
                  transition-all duration-200 hover:scale-105 active:scale-95
                "
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="
                flex items-center justify-center
                w-14 h-14 md:w-16 md:h-16
                rounded-full
                bg-gradient-to-b from-gray-700 to-gray-800
                hover:from-yellow-500 hover:to-yellow-600
                text-white hover:text-black
                text-3xl font-bold
                shadow-lg shadow-black/30
                transition-all duration-300
                hover:scale-110 hover:rotate-90
                active:scale-95
                border border-white/10 hover:border-yellow-400
              "
              title="Add player"
            >
              +
            </button>
          )
        )}
      </div>

      {players.length === 0 && (
        <p className="text-center text-gray-500 text-sm mt-4 tracking-wide animate-fade-in">
          Click + to add players
        </p>
      )}
    </div>
  );
}
