"use client"

import Image from "next/image"
import { Typography } from "@/components/ui/typography"
import { WelcomeHeader } from "@/components/landing/welcome-header"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import api from "@/lib/api"

const WelcomePage = () => {
  const { data: session, update } = useSession()
  const { replace } = useRouter()
  const setting = useRef(false)

  useEffect(() => {
    if (session && !session.user.init && !setting.current) {
      console.log("setuppppp")
      setting.current = true
      api
        .withToken(session.accessToken)
        .initUser()
        .then(async () => {
          await update({ init: true })
          replace("/dashboard")
        })
    }
  }, [session])

  return (
    <div className="bg-blur-image">
      <WelcomeHeader />
      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:px-0">
        <div className="w-full flex flex-col items-center max-w-md rounded-2xl bg-white px-6 py-10 shadow-card">
          <Image src="/assets/wait.png" alt="wait" width={180} height={180} />
          <Typography as="h6" className="mt-6 font-semibold text-center">
            Please wait while we set up your account.
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
