import Link from "next/link";
import { DemoBoard } from "./components/DemoBoard";
import { dummyBoard } from "./data/dummy-board";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-wider drop-shadow-2xl mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 animate-glow inline-block">
              JOE
            </span>
            <span className="text-white">-PARDY!</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Create custom trivia boards to prove you're smarter than your friends, family, or coworkers!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin"
              className="
                inline-block px-8 py-4
                bg-gradient-to-b from-yellow-400 to-yellow-500
                hover:from-yellow-300 hover:to-yellow-400
                text-black font-bold text-lg rounded-xl
                shadow-lg shadow-yellow-500/30
                transition-all hover:scale-105 active:scale-95
              "
            >
              Create Your Board
            </Link>
            <a
              href="#demo"
              className="
                inline-block px-8 py-4
                bg-white/10 hover:bg-white/20
                text-white font-bold text-lg rounded-xl
                border border-white/20 hover:border-white/40
                transition-all hover:scale-105 active:scale-95
              "
            >
              Try the Demo
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500 flex items-center justify-center text-3xl font-black text-black">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Create a Board</h3>
              <p className="text-gray-400">
                Design your own trivia categories and clues with custom point values. Perfect for any topic or theme.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500 flex items-center justify-center text-3xl font-black text-black">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Add Players</h3>
              <p className="text-gray-400">
                Set up your contestants and track their scores in real-time as you play through the game.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-500 flex items-center justify-center text-3xl font-black text-black">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Play Together</h3>
              <p className="text-gray-400">
                Share your board with anyone. They can play without signing up - just send them the link!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
            Perfect For
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Team Building", desc: "Office trivia nights" },
              { title: "Classrooms", desc: "Educational review games" },
              { title: "Parties", desc: "Birthday & holiday fun" },
              { title: "Family Game Night", desc: "All ages entertainment" },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  p-6 rounded-xl
                  bg-gradient-to-b from-[#0a10d0] to-[#060CE9]
                  border border-white/10
                  shadow-lg shadow-black/30
                  hover:scale-105 transition-transform
                "
              >
                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Try It Out
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Click any dollar value to reveal the clue. Mark players as correct or incorrect to update their scores.
            </p>
          </div>
          <DemoBoard board={dummyBoard} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to Host?
          </h2>
          <p className="text-gray-400 mb-8">
            Sign in with Google to create and save your own trivia boards.
          </p>
          <Link
            href="/admin"
            className="
              inline-block px-8 py-4
              bg-gradient-to-b from-yellow-400 to-yellow-500
              hover:from-yellow-300 hover:to-yellow-400
              text-black font-bold text-lg rounded-xl
              shadow-lg shadow-yellow-500/30
              transition-all hover:scale-105 active:scale-95
            "
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>Built for my friends in Velo &lt;3</p>
        </div>
      </footer>
    </main>
  );
}
