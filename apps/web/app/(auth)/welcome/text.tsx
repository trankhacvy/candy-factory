"use client"

import api from "@/lib/api"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MyText() {
  const { data: session, update } = useSession()
  const { replace } = useRouter()

  useEffect(() => {
    if (session && !session.user.init) {
      api
        .withToken(session.accessToken)
        .initUser()
        .then(async () => {
          await update({ init: true })
          replace("/dashboard")
        })
    }
  }, [session])

  return <></>
}
