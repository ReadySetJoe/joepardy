"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return (
      <div className="h-10 w-24 bg-white/10 rounded-lg animate-pulse" />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-white/70 text-sm hidden sm:inline">
          {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="
            px-4 py-2
            bg-white/10 hover:bg-white/20
            text-white/70 hover:text-white
            font-medium text-sm rounded-lg
            transition-all
          "
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="
        px-4 py-2
        bg-gradient-to-b from-yellow-400 to-yellow-500
        hover:from-yellow-300 hover:to-yellow-400
        text-black font-bold text-sm rounded-lg
        shadow-lg shadow-yellow-500/30
        transition-all hover:scale-105 active:scale-95
      "
    >
      Sign in
    </button>
  )
}
