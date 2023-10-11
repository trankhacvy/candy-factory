import { SigninMessage } from "@/lib/signin-message"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import api from "./api"

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        message: {
          label: "Message",
          type: "text",
        },
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {
          const signinMessage = new SigninMessage(JSON.parse(credentials?.message || "{}") as any)
          // const nextAuthUrl = new URL(process.env.NEXTAUTH_URL);
          // if (signinMessage.domain !== nextAuthUrl.host) {
          //   return null;
          // }

          // if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
          //   return null;
          // }

          const validationResult = await signinMessage.validate(credentials?.signature || "")

          if (!validationResult) throw new Error("Could not validate the signed message")

          const wallet = signinMessage.publicKey

          const response = await api.login(wallet)

          // console.log("login response: ", { response })

          return response
        } catch (e) {
          console.log("[authorize] error", e)
          return null
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  cookies: {
    sessionToken: {
      name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
        // domain: VERCEL_DEPLOYMENT ? `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` : undefined,
        secure: VERCEL_DEPLOYMENT,
      },
    },
  },
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      //   console.log("[jwt] token", token)
      //   console.log("[jwt] user", user)

      if (user && user.token) {
        token = { accessToken: user.token, user: user.user }
      }

      if (trigger === "update") {
        console.log("handle update: ", session)
        if (typeof session.init === "boolean" && !!token.user) {
          token.user.init = session.init
        }

        // handle update
        // console.log("[jwt] token", token)
        // console.log("[jwt] user", user)
        // console.log("[jwt] session", session)
      }

      return token
    },
    session: async ({ session, token, user }) => {
      // console.log("[session] session", session)
      // console.log("[session] token", token)
      //   console.log("[session] user", user)

      const isValid = isValidAccessToken(token.accessToken)

      session.accessToken = token.accessToken
      session.user = token.user

      if (!isValid) {
        session.error = "TOKEN_EXPIRED"
      }

      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}

function parseJWT(token: string) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
}

type JwtObject = {
  id: number
  sessionId: number
  iat: number
  exp: number
}

function isValidAccessToken(token: string) {
  try {
    const jwt = parseJWT(token ?? "") as JwtObject
    const exp = jwt.exp ?? 0

    const currentTime = Math.floor(Date.now() / 1000)

    return exp >= currentTime
  } catch (error) {
    return false
  }
}
