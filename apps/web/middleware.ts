import { withAuth } from "next-auth/middleware"
import { signOut } from "next-auth/react"
import { NextResponse } from "next/server"
import api from "./lib/api"

type JwtObject = {
  id: number
  sessionId: number
  iat: number
  exp: number
}

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const token = req.nextauth.token
    if (token && !token.user.init) {
      return NextResponse.redirect(new URL("/welcome", req.url))
    }
  },
  {
    callbacks: {
      authorized: async ({ token }) => {
        try {
          const jwt = parseJWT(token?.accessToken ?? "") as JwtObject
          const exp = jwt.exp ?? 0

          const currentTime = Math.floor(Date.now() / 1000)

          if (exp < currentTime) {
            console.log("Access token has expired.")
            return false
          } else {
            console.log("Access token is still valid.")
            return true
          }
        } catch (error) {
          return false
        }
      },
    },
  }
)

function parseJWT(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
}

export const config = { matcher: ["/dashboard/:path*"] }
