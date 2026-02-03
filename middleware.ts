import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// Use the edge-compatible config (no Prisma adapter)
export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/admin/:path*"],
}
