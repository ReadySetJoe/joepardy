"use client";

import { useState, useEffect, useMemo } from "react";
import { GameBoard as GameBoardType, Clue, Player, Game, GamePlayer, ClueAnswer } from "../types";
import { ClueModal, PlayerResult } from "./ClueModal";
import { PlayerPanel } from "./PlayerPanel";

interface GameBoardProps {
  board: GameBoardType;
  game?: Game;
  onAddPlayer?: (name: string) => Promise<GamePlayer>;
  onClueResult?: (clueId: string, results: { playerId: string | null; result: ClueAnswer; scoreChange: number }[]) => Promise<void>;
  onUpdateScore?: (playerId: string, newScore: number) => Promise<void>;
  onReactivateClue?: (clueId: string) => Promise<void>;
  readOnly?: boolean;
}

interface SelectedClue {
  clue: Clue;
  categoryIndex: number;
  clueIndex: number;
}

export function GameBoard({ board, game, onAddPlayer, onClueResult, onUpdateScore, onReactivateClue, readOnly = false }: GameBoardProps) {
  // Derive revealed clues from game state if available
  const revealedClueIds = useMemo(() => {
    if (!game) return new Set<string>();
    return new Set(game.clueResults.map((r) => r.clueId));
  }, [game]);

  // Local state for non-persisted mode or UI state
  const [localRevealedClues, setLocalRevealedClues] = useState<Set<string>>(new Set());
  const [selectedClue, setSelectedClue] = useState<SelectedClue | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [localPlayers, setLocalPlayers] = useState<Player[]>([]);
  const [playerResults, setPlayerResults] = useState<Record<string, PlayerResult>>({});
  const [saving, setSaving] = useState(false);

  // Use game players if available, otherwise local state
  const players: Player[] = useMemo(() => {
    if (game) {
      return game.players.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
      }));
    }
    return localPlayers;
  }, [game, localPlayers]);

  // Combine revealed clues from game state and local state
  const isClueRevealed = (clue: Clue, categoryIndex: number, clueIndex: number): boolean => {
    // If clue has an ID, check the game's clue results
    if (clue.id && revealedClueIds.has(clue.id)) {
      return true;
    }
    // Fall back to local state using position key
    const key = `${categoryIndex}-${clueIndex}`;
    return localRevealedClues.has(key);
  };

  const handleAddPlayer = async (name: string) => {
    if (onAddPlayer) {
      // Persisted mode - call API
      try {
        await onAddPlayer(name);
      } catch (err) {
        console.error("Failed to add player:", err);
      }
    } else {
      // Local mode
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name,
        score: 0,
      };
      setLocalPlayers((prev) => [...prev, newPlayer]);
    }
  };

  const handleUpdateScore = async (playerId: string, newScore: number) => {
    if (onUpdateScore) {
      // Persisted mode - call API
      try {
        await onUpdateScore(playerId, newScore);
      } catch (err) {
        console.error("Failed to update score:", err);
      }
    } else {
      // Local mode
      setLocalPlayers((prev) =>
        prev.map((p) => (p.id === playerId ? { ...p, score: newScore } : p))
      );
    }
  };

  const handleClueClick = (clue: Clue, categoryIndex: number, clueIndex: number) => {
    if (readOnly) return;
    if (isClueRevealed(clue, categoryIndex, clueIndex)) return;

    setSelectedClue({ clue, categoryIndex, clueIndex });
    setShowAnswer(false);
    setPlayerResults({});
  };

  const handleReactivateClue = async (clue: Clue, categoryIndex: number, clueIndex: number) => {
    if (readOnly) return;
    if (!confirm("Reactivate this clue? This will reverse any score changes from the previous answer.")) return;

    if (onReactivateClue && clue.id) {
      // Persisted mode - call API
      setSaving(true);
      try {
        await onReactivateClue(clue.id);
      } catch (err) {
        console.error("Failed to reactivate clue:", err);
      } finally {
        setSaving(false);
      }
    } else {
      // Local mode - just remove from revealed set
      const key = `${categoryIndex}-${clueIndex}`;
      setLocalRevealedClues((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
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

  const handleConfirm = async () => {
    if (!selectedClue) return;

    if (onClueResult && selectedClue.clue.id) {
      // Persisted mode - call API
      setSaving(true);
      try {
        const results = players.map((player) => {
          const result = playerResults[player.id];
          let clueResult: ClueAnswer = "SKIPPED";
          let scoreChange = 0;

          if (result === "correct") {
            clueResult = "CORRECT";
            scoreChange = selectedClue.clue.value;
          } else if (result === "incorrect") {
            clueResult = "INCORRECT";
            scoreChange = -selectedClue.clue.value;
          }

          return {
            playerId: player.id,
            result: clueResult,
            scoreChange,
          };
        });

        await onClueResult(selectedClue.clue.id, results);
      } catch (err) {
        console.error("Failed to record clue result:", err);
      } finally {
        setSaving(false);
      }
    } else {
      // Local mode - update local state
      setLocalPlayers((prev) =>
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
      setLocalRevealedClues((prev) => new Set([...prev, key]));
    }

    setSelectedClue(null);
    setShowAnswer(false);
    setPlayerResults({});
  };

  const numClues = board.categories[0]?.clues.length ?? 5;

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 animate-slide-up">
        <div
          className="grid gap-2 md:gap-3"
          style={{ gridTemplateColumns: `repeat(${board.categories.length}, minmax(0, 1fr))` }}
        >
          {/* Category Headers */}
          {board.categories.map((category, catIndex) => (
            <div
              key={catIndex}
              className={`
                relative overflow-hidden
                bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
                p-3 md:p-4
                flex items-center justify-center
                min-h-[70px] md:min-h-[90px]
                rounded-t-lg
                shadow-lg shadow-black/50
                border-b-4 border-[#ffcc00]/30
                opacity-0 animate-slide-down
              `}
              style={{ animationDelay: `${catIndex * 0.05}s`, animationFillMode: 'forwards' }}
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
              const isRevealed = isClueRevealed(clue, catIndex, rowIndex);
              const delay = (rowIndex * board.categories.length + catIndex) * 0.02;

              return (
                <button
                  key={`${catIndex}-${rowIndex}`}
                  onClick={() =>
                    isRevealed
                      ? handleReactivateClue(clue, catIndex, rowIndex)
                      : handleClueClick(clue, catIndex, rowIndex)
                  }
                  disabled={readOnly}
                  className={`
                    relative overflow-hidden
                    aspect-[4/3] md:aspect-auto md:min-h-[70px] lg:min-h-[85px]
                    flex items-center justify-center
                    text-lg md:text-2xl lg:text-3xl font-black
                    rounded-md
                    shadow-md
                    transition-all duration-300 ease-out
                    opacity-0 animate-scale-in
                    ${isRevealed
                      ? readOnly
                        ? "bg-[#060CE9]/20 cursor-default shadow-none"
                        : "bg-[#060CE9]/20 shadow-none cursor-pointer hover:bg-[#060CE9]/40 hover:shadow-md"
                      : readOnly
                        ? "bg-gradient-to-b from-[#0a10d0] to-[#060CE9] cursor-default"
                        : `bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
                           hover:from-[#1a20ff] hover:to-[#0a10d0]
                           cursor-pointer
                           hover:scale-105 hover:z-10
                           hover:shadow-xl hover:shadow-yellow-500/20
                           active:scale-95`
                    }
                  `}
                  style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
                >
                  <span
                    className={`
                      drop-shadow-lg transition-all duration-300
                      ${isRevealed
                        ? readOnly
                          ? "opacity-0 scale-50"
                          : "opacity-30 text-white/50 text-sm md:text-base"
                        : "text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500"
                      }
                    `}
                  >
                    {isRevealed && !readOnly ? "↺" : `$${clue.value}`}
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
      
      <PlayerPanel
        players={players}
        onAddPlayer={handleAddPlayer}
        onUpdateScore={handleUpdateScore}
        readOnly={readOnly}
      />

      <ClueModal
        clue={selectedClue?.clue ?? null}
        showAnswer={showAnswer}
        players={players}
        playerResults={playerResults}
        onRevealAnswer={handleRevealAnswer}
        onPlayerResult={handlePlayerResult}
        onConfirm={handleConfirm}
        saving={saving}
      />
    </>
  );
}
