"use client";

import { Clue, Player } from "../types";

export type PlayerResult = "correct" | "incorrect" | null;

interface ClueModalProps {
  clue: Clue | null;
  showAnswer: boolean;
  players: Player[];
  playerResults: Record<string, PlayerResult>;
  onRevealAnswer: () => void;
  onPlayerResult: (playerId: string, result: PlayerResult) => void;
  onConfirm: () => void;
  saving?: boolean;
}

export function ClueModal({
  clue,
  showAnswer,
  players,
  playerResults,
  onRevealAnswer,
  onPlayerResult,
  onConfirm,
  saving = false,
}: ClueModalProps) {
  if (!clue) return null;

  const getPendingChange = (playerId: string): number => {
    const result = playerResults[playerId];
    if (result === "correct") return clue.value;
    if (result === "incorrect") return -clue.value;
    return 0;
  };

  const getTotalPendingChange = (): number => {
    return Object.keys(playerResults).reduce((sum, playerId) => {
      return sum + getPendingChange(playerId);
    }, 0);
  };

  const hasPendingChanges = Object.values(playerResults).some((r) => r !== null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="
          relative
          w-full max-w-4xl
          max-h-[90vh] overflow-y-auto
          bg-gradient-to-b from-[#0a10d0] to-[#050a9a]
          rounded-2xl
          shadow-2xl shadow-black/50
          border border-white/10
          animate-scale-in
        "
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <div className="p-6 md:p-8">
          {/* Value Badge */}
          <div className="flex justify-center mb-6">
            <div className="
              px-6 py-2
              bg-black/30
              rounded-full
              border border-yellow-400/30
              shadow-lg shadow-yellow-500/10
            ">
              <span className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500">
                ${clue.value}
              </span>
            </div>
          </div>

          {/* Clue Text */}
          <div className="text-center mb-8">
            <p className="
              text-xl md:text-3xl lg:text-4xl
              font-bold
              text-white
              uppercase
              tracking-wide
              leading-relaxed
              drop-shadow-lg
            ">
              {clue.question}
            </p>
          </div>

          {/* Answer Section */}
          <div className="mb-8">
            {showAnswer ? (
              <div className="
                bg-black/30
                rounded-xl
                p-5
                text-center
                border border-green-500/30
                shadow-lg shadow-green-500/10
                animate-reveal
              ">
                <p className="text-green-400/70 text-xs uppercase tracking-widest mb-2">
                  Answer
                </p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-400 uppercase tracking-wide">
                  {clue.answer}
                </p>
              </div>
            ) : (
              <button
                onClick={onRevealAnswer}
                className="
                  w-full
                  py-4
                  bg-gradient-to-b from-yellow-400 to-yellow-500
                  hover:from-yellow-300 hover:to-yellow-400
                  text-black
                  font-bold
                  text-lg
                  rounded-xl
                  shadow-lg shadow-yellow-500/30
                  transition-all duration-200
                  hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/40
                  active:scale-[0.98]
                "
              >
                Reveal Answer
              </button>
            )}
          </div>

          {/* Player Scoring Section */}
          {players.length > 0 && (
            <div className="mb-8">
              <p className="text-white/50 text-xs uppercase tracking-widest mb-4 text-center">
                Player Scores
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {players.map((player, index) => {
                  const result = playerResults[player.id];
                  const pendingChange = getPendingChange(player.id);

                  return (
                    <div
                      key={player.id}
                      className={`
                        relative overflow-hidden
                        rounded-xl
                        p-4
                        border-2
                        transition-all duration-300
                        opacity-0 animate-slide-up
                        ${result === "correct"
                          ? "bg-green-900/40 border-green-500 shadow-lg shadow-green-500/20"
                          : result === "incorrect"
                          ? "bg-red-900/40 border-red-500 shadow-lg shadow-red-500/20"
                          : "bg-black/30 border-white/10"
                        }
                      `}
                      style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-bold tracking-wide">{player.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`
                            text-lg font-black
                            ${player.score < 0 ? "text-red-400" : "text-white/80"}
                          `}>
                            ${player.score.toLocaleString()}
                          </span>
                          {pendingChange !== 0 && (
                            <span className={`
                              text-sm font-bold px-2 py-0.5 rounded-full animate-pulse-once
                              ${pendingChange > 0
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                              }
                            `}>
                              {pendingChange > 0 ? "+" : ""}{pendingChange}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onPlayerResult(player.id, result === "correct" ? null : "correct")}
                          className={`
                            flex-1
                            py-2.5 px-3
                            rounded-lg
                            font-bold
                            text-sm
                            transition-all duration-200
                            ${result === "correct"
                              ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                              : "bg-white/10 text-white/60 hover:bg-green-500/80 hover:text-white"
                            }
                          `}
                        >
                          +
                        </button>
                        <button
                          onClick={() => onPlayerResult(player.id, result === "incorrect" ? null : "incorrect")}
                          className={`
                            flex-1
                            py-2.5 px-3
                            rounded-lg
                            font-bold
                            text-sm
                            transition-all duration-200
                            ${result === "incorrect"
                              ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                              : "bg-white/10 text-white/60 hover:bg-red-500/80 hover:text-white"
                            }
                          `}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary & Confirm */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={onConfirm}
              disabled={saving}
              className="
                px-12 py-4
                bg-gradient-to-b from-gray-600 to-gray-700
                hover:from-gray-500 hover:to-gray-600
                text-white
                font-bold
                text-lg
                rounded-xl
                shadow-lg shadow-black/30
                transition-all duration-200
                hover:scale-105
                active:scale-95
                border border-white/10
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {saving ? "Saving..." : hasPendingChanges ? "Confirm & Continue" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
