"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BoardFromAPI, CategoryFromAPI, ClueFromAPI, fetchBoard, updateBoard } from "../../lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditBoardPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [board, setBoard] = useState<BoardFromAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedClue, setSelectedClue] = useState<{ cat: number; clue: number } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBoard = async () => {
      try {
        const loaded = await fetchBoard(id);
        if (!loaded) {
          router.push("/admin");
          return;
        }
        setBoard(loaded);
      } catch (err) {
        setError("Failed to load board");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadBoard();
  }, [id, router]);

  const handleSave = async () => {
    if (!board) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateBoard(board.id, {
        name: board.name,
        categories: board.categories,
      });
      setBoard(updated);
      setHasChanges(false);
    } catch (err) {
      setError("Failed to save board");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateBoardName = (name: string) => {
    if (!board) return;
    setBoard({ ...board, name });
    setHasChanges(true);
  };

  const updateCategory = (index: number, category: CategoryFromAPI) => {
    if (!board) return;
    const categories = [...board.categories];
    categories[index] = category;
    setBoard({ ...board, categories });
    setHasChanges(true);
  };

  const updateClue = (catIndex: number, clueIndex: number, clue: ClueFromAPI) => {
    if (!board) return;
    const categories = [...board.categories];
    const clues = [...categories[catIndex].clues];
    clues[clueIndex] = clue;
    categories[catIndex] = { ...categories[catIndex], clues };
    setBoard({ ...board, categories });
    setHasChanges(true);
  };

  const addCategory = () => {
    if (!board) return;
    const newCategory: CategoryFromAPI = {
      id: `new-${Date.now()}`,
      name: `Category ${board.categories.length + 1}`,
      order: board.categories.length,
      boardId: board.id,
      clues: Array.from({ length: 5 }, (_, i) => ({
        id: `new-clue-${Date.now()}-${i}`,
        value: (i + 1) * 100,
        question: "",
        answer: "",
        order: i,
        categoryId: `new-${Date.now()}`,
      })),
    };
    setBoard({ ...board, categories: [...board.categories, newCategory] });
    setHasChanges(true);
  };

  const removeCategory = (index: number) => {
    if (!board || board.categories.length <= 1) return;
    const categories = board.categories.filter((_, i) => i !== index);
    setBoard({ ...board, categories });
    setSelectedCategory(null);
    setSelectedClue(null);
    setHasChanges(true);
  };

  const addClue = (catIndex: number) => {
    if (!board) return;
    const categories = [...board.categories];
    const clues = [...categories[catIndex].clues];
    const lastValue = clues[clues.length - 1]?.value ?? 0;
    const newClue: ClueFromAPI = {
      id: `new-clue-${Date.now()}`,
      value: lastValue + 100,
      question: "",
      answer: "",
      order: clues.length,
      categoryId: categories[catIndex].id,
    };
    clues.push(newClue);
    categories[catIndex] = { ...categories[catIndex], clues };
    setBoard({ ...board, categories });
    setHasChanges(true);
  };

  const removeClue = (catIndex: number, clueIndex: number) => {
    if (!board) return;
    const categories = [...board.categories];
    if (categories[catIndex].clues.length <= 1) return;
    const clues = categories[catIndex].clues.filter((_, i) => i !== clueIndex);
    categories[catIndex] = { ...categories[catIndex], clues };
    setBoard({ ...board, categories });
    setSelectedClue(null);
    setHasChanges(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-white/50">Loading...</p>
      </main>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-6 animate-slide-down">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="text-yellow-400/70 hover:text-yellow-400 text-sm uppercase tracking-widest transition-colors"
            >
              &larr; Back to Boards
            </Link>
            <div className="flex gap-3">
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
                Preview
              </Link>
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className={`
                  px-6 py-2 font-bold text-sm rounded-lg
                  transition-all hover:scale-105 active:scale-95
                  ${hasChanges
                    ? "bg-gradient-to-b from-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/30"
                    : "bg-white/10 text-white/30 cursor-not-allowed"
                  }
                `}
              >
                {saving ? "Saving..." : hasChanges ? "Save Changes" : "Saved"}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 animate-fade-in">
              {error}
            </div>
          )}

          {/* Board Name */}
          <input
            type="text"
            value={board.name}
            onChange={(e) => updateBoardName(e.target.value)}
            className="
              mt-4 text-3xl md:text-4xl font-black text-white
              bg-transparent border-b-2 border-transparent
              hover:border-white/20 focus:border-yellow-400
              focus:outline-none transition-colors
              w-full
            "
          />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-1 space-y-3 animate-slide-up">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-white/50 text-xs uppercase tracking-widest">Categories</h2>
              <button
                onClick={addCategory}
                className="text-yellow-400 hover:text-yellow-300 text-sm font-bold transition-colors"
              >
                + Add
              </button>
            </div>
            {board.categories.map((category, catIndex) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(catIndex);
                  setSelectedClue(null);
                }}
                className={`
                  w-full text-left p-4 rounded-xl
                  transition-all duration-200
                  ${selectedCategory === catIndex
                    ? "bg-gradient-to-b from-[#0a10d0] to-[#060CE9] border-2 border-yellow-400 shadow-lg shadow-yellow-500/20"
                    : "bg-black/30 border-2 border-transparent hover:border-white/20"
                  }
                `}
              >
                <span className="text-white font-bold">{category.name || "Untitled"}</span>
                <span className="text-white/40 text-sm ml-2">({category.clues.length} clues)</span>
              </button>
            ))}
          </div>

          {/* Editor Panel */}
          <div className="lg:col-span-2 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {selectedCategory !== null ? (
              <div className="bg-gradient-to-b from-[#0a10d0]/50 to-[#060CE9]/50 rounded-2xl p-6 border border-white/10">
                {/* Category Editor */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white/50 text-xs uppercase tracking-widest">Category Name</label>
                    <button
                      onClick={() => removeCategory(selectedCategory)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors"
                    >
                      Delete Category
                    </button>
                  </div>
                  <input
                    type="text"
                    value={board.categories[selectedCategory].name}
                    onChange={(e) =>
                      updateCategory(selectedCategory, {
                        ...board.categories[selectedCategory],
                        name: e.target.value,
                      })
                    }
                    placeholder="Category name..."
                    className="
                      w-full px-4 py-3
                      bg-black/30 border-2 border-white/10
                      rounded-xl text-white text-lg font-bold
                      placeholder-white/30
                      focus:border-yellow-400 focus:outline-none
                      transition-colors
                    "
                  />
                </div>

                {/* Clues List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-white/50 text-xs uppercase tracking-widest">Clues</label>
                    <button
                      onClick={() => addClue(selectedCategory)}
                      className="text-yellow-400 hover:text-yellow-300 text-xs font-bold transition-colors"
                    >
                      + Add Clue
                    </button>
                  </div>
                  <div className="space-y-2">
                    {board.categories[selectedCategory].clues.map((clue, clueIndex) => (
                      <button
                        key={clue.id}
                        onClick={() => setSelectedClue({ cat: selectedCategory, clue: clueIndex })}
                        className={`
                          w-full text-left p-3 rounded-lg
                          transition-all duration-200
                          ${selectedClue?.cat === selectedCategory && selectedClue?.clue === clueIndex
                            ? "bg-yellow-400/20 border-2 border-yellow-400"
                            : "bg-black/20 border-2 border-transparent hover:border-white/10"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-yellow-400 font-black text-lg">${clue.value}</span>
                          <span className="text-white/70 text-sm truncate flex-1">
                            {clue.question || <span className="text-white/30 italic">No question</span>}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clue Editor */}
                {selectedClue && selectedClue.cat === selectedCategory && (
                  <div className="mt-6 pt-6 border-t border-white/10 animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-bold">Edit Clue</h3>
                      <button
                        onClick={() => removeClue(selectedClue.cat, selectedClue.clue)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors"
                      >
                        Delete Clue
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Value</label>
                        <input
                          type="number"
                          value={board.categories[selectedClue.cat].clues[selectedClue.clue].value}
                          onChange={(e) =>
                            updateClue(selectedClue.cat, selectedClue.clue, {
                              ...board.categories[selectedClue.cat].clues[selectedClue.clue],
                              value: parseInt(e.target.value) || 0,
                            })
                          }
                          className="
                            w-32 px-4 py-2
                            bg-black/30 border-2 border-white/10
                            rounded-lg text-yellow-400 font-bold
                            focus:border-yellow-400 focus:outline-none
                            transition-colors
                          "
                        />
                      </div>

                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Question (Clue)</label>
                        <textarea
                          value={board.categories[selectedClue.cat].clues[selectedClue.clue].question}
                          onChange={(e) =>
                            updateClue(selectedClue.cat, selectedClue.clue, {
                              ...board.categories[selectedClue.cat].clues[selectedClue.clue],
                              question: e.target.value,
                            })
                          }
                          placeholder="This planet is known as the Red Planet..."
                          rows={3}
                          className="
                            w-full px-4 py-3
                            bg-black/30 border-2 border-white/10
                            rounded-xl text-white
                            placeholder-white/30
                            focus:border-yellow-400 focus:outline-none
                            transition-colors resize-none
                          "
                        />
                      </div>

                      <div>
                        <label className="text-white/50 text-xs uppercase tracking-widest block mb-2">Answer</label>
                        <input
                          type="text"
                          value={board.categories[selectedClue.cat].clues[selectedClue.clue].answer}
                          onChange={(e) =>
                            updateClue(selectedClue.cat, selectedClue.clue, {
                              ...board.categories[selectedClue.cat].clues[selectedClue.clue],
                              answer: e.target.value,
                            })
                          }
                          placeholder="What is Mars?"
                          className="
                            w-full px-4 py-3
                            bg-black/30 border-2 border-white/10
                            rounded-xl text-green-400
                            placeholder-white/30
                            focus:border-yellow-400 focus:outline-none
                            transition-colors
                          "
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-black/20 rounded-2xl p-12 text-center border-2 border-dashed border-white/10">
                <p className="text-white/40">Select a category to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
