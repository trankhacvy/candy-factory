import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    refreshToken: string
    token: string
    tokenExpires: number
    user: {
      wallet: string
      firstName: any
      lastName: any
      deletedAt: any
      id: number
      status: number
      createdAt: string
      updatedAt: string
    }
  }

  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken: string
    user: User["user"]
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string
    user: {
      wallet: string
      firstName: any
      lastName: any
      deletedAt: any
      id: number
      status: number
      createdAt: string
      updatedAt: string
    }
  }
}
