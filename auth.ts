import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/app/lib/prisma"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      // Add user id to the JWT token on sign in
      if (user) {
        token.id = user.id
      }
      return token
    },
    session({ session, token }) {
      // Add user id to the session from JWT token
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
