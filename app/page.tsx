import Link from "next/link";
import { GameBoard } from "./components/GameBoard";
import { dummyBoard } from "./data/dummy-board";

export default function Home() {
  return (
    <main className="min-h-screen py-8">
      <header className="text-center mb-8 animate-slide-down">
        <Link
          href="/admin"
          className="
            inline-block mb-4 px-4 py-2
            bg-white/5 hover:bg-white/10
            text-white/50 hover:text-yellow-400
            text-xs uppercase tracking-widest
            rounded-full border border-white/10 hover:border-yellow-400/50
            transition-all duration-300
          "
        >
          Manage Boards &rarr;
        </Link>
        <h1 className="text-5xl md:text-7xl font-black tracking-wider drop-shadow-2xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-glow inline-block">
            JOE
          </span>
          <span className="text-white">-PARDY!</span>
        </h1>
        <p className="text-gray-500 mt-3 text-sm tracking-widest uppercase">
          Click a value to reveal the clue
        </p>
      </header>

      <GameBoard board={dummyBoard} />
    </main>
  );
}
