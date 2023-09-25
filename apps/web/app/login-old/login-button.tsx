"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { WalletIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function LoginButton() {
  const router = useRouter()

  const supabase = createClientComponentClient()

  const login = async () => {
    const result = await supabase.auth.signUp({
      email: "tester1@xx.com",
      password: "123456",
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    console.log("result", result)
    router.refresh()
  }

  return (
    <Button
      onClick={() => {
        login()
      }}
      fullWidth
      startDecorator={<WalletIcon />}
    >
      Connect Wallet
    </Button>
  )
}
