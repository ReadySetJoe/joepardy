"use client";

import { useState, useMemo } from "react";
import { GameBoard as GameBoardType, Clue, Player } from "../types";
import { ClueModal, PlayerResult } from "./ClueModal";

interface DemoBoardProps {
  board: GameBoardType;
}

interface SelectedClue {
  clue: Clue;
  categoryIndex: number;
  clueIndex: number;
}

export function DemoBoard({ board }: DemoBoardProps) {
  const [revealedClues, setRevealedClues] = useState<Set<string>>(new Set());
  const [selectedClue, setSelectedClue] = useState<SelectedClue | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "John", score: 400 },
    { id: "2", name: "Jane", score: 600 },
  ]);
  const [playerResults, setPlayerResults] = useState<Record<string, PlayerResult>>({});

  const isClueRevealed = (categoryIndex: number, clueIndex: number): boolean => {
    const key = `${categoryIndex}-${clueIndex}`;
    return revealedClues.has(key);
  };

  const handleClueClick = (clue: Clue, categoryIndex: number, clueIndex: number) => {
    if (isClueRevealed(categoryIndex, clueIndex)) return;
    setSelectedClue({ clue, categoryIndex, clueIndex });
    setShowAnswer(false);
    setPlayerResults({});
  };

  const handleRevealAnswer = () => {
    setShowAnswer(true);
  };

  const handlePlayerResult = (playerId: string, result: PlayerResult) => {
    setPlayerResults((prev) => ({
      ...prev,
      [playerId]: result,
    }));
  };

  const handleConfirm = () => {
    if (!selectedClue) return;

    setPlayers((prev) =>
      prev.map((player) => {
        const result = playerResults[player.id];
        if (result === "correct") {
          return { ...player, score: player.score + selectedClue.clue.value };
        } else if (result === "incorrect") {
          return { ...player, score: player.score - selectedClue.clue.value };
        }
        return player;
      })
    );

    const key = `${selectedClue.categoryIndex}-${selectedClue.clueIndex}`;
    setRevealedClues((prev) => new Set([...prev, key]));

    setSelectedClue(null);
    setShowAnswer(false);
    setPlayerResults({});
  };

  const numClues = board.categories[0]?.clues.length ?? 5;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4">
        <div
          className="grid gap-2 md:gap-3"
          style={{ gridTemplateColumns: `repeat(${board.categories.length}, minmax(0, 1fr))` }}
        >
          {/* Category Headers */}
          {board.categories.map((category, catIndex) => (
            <div
              key={catIndex}
              className="
                relative overflow-hidden
                bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
                p-3 md:p-4
                flex items-center justify-center
                min-h-[70px] md:min-h-[90px]
                rounded-t-lg
                shadow-lg shadow-black/50
                border-b-4 border-[#ffcc00]/30
              "
            >
              <h2 className="text-white text-xs md:text-sm lg:text-base font-black text-center uppercase tracking-wider drop-shadow-lg">
                {category.name}
              </h2>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none" />
            </div>
          ))}

          {/* Clue Cells - Row by Row */}
          {Array.from({ length: numClues }).map((_, rowIndex) =>
            board.categories.map((category, catIndex) => {
              const clue = category.clues[rowIndex];
              const isRevealed = isClueRevealed(catIndex, rowIndex);

              return (
                <button
                  key={`${catIndex}-${rowIndex}`}
                  onClick={() => handleClueClick(clue, catIndex, rowIndex)}
                  className={`
                    relative overflow-hidden
                    aspect-[4/3] md:aspect-auto md:min-h-[70px] lg:min-h-[85px]
                    flex items-center justify-center
                    text-lg md:text-2xl lg:text-3xl font-black
                    rounded-md
                    shadow-md
                    transition-all duration-300 ease-out
                    ${isRevealed
                      ? "bg-[#060CE9]/20 shadow-none cursor-default"
                      : `bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
                         hover:from-[#1a20ff] hover:to-[#0a10d0]
                         cursor-pointer
                         hover:scale-105 hover:z-10
                         hover:shadow-xl hover:shadow-yellow-500/20
                         active:scale-95`
                    }
                  `}
                >
                  <span
                    className={`
                      drop-shadow-lg transition-all duration-300
                      ${isRevealed
                        ? "opacity-0 scale-50"
                        : "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500"
                      }
                    `}
                  >
                    ${clue.value}
                  </span>
                  {!isRevealed && (
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 pointer-events-none" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Player Scores */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {players.map((player) => (
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
                transition-transform duration-200 hover:scale-105
              "
            >
              <span className="font-bold text-base md:text-lg text-white/90 tracking-wide">
                {player.name}
              </span>
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
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <ClueModal
        clue={selectedClue?.clue ?? null}
        showAnswer={showAnswer}
        players={players}
        playerResults={playerResults}
        onRevealAnswer={handleRevealAnswer}
        onPlayerResult={handlePlayerResult}
        onConfirm={handleConfirm}
        saving={false}
      />
    </>
  );
}
