"use client"

import { useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useWalletLogin } from "@/hooks/use-wallet-login"

export default function LandingSignUpButton() {
  const { status } = useSession()

  const wallet = useWallet()

  const { handleSignIn } = useWalletLogin()

  if (!wallet.connected) {
    return (
      <Button as="a" href="/login" className="px-6" size="lg">
        Launch airdrop now
      </Button>
    )
  }

  if (status === "unauthenticated" || status === "loading") {
    return (
      <Button className="px-6" size="lg" fullWidth onClick={handleSignIn}>
        Launch airdrop now
      </Button>
    )
  }

  return (
    <Button fullWidth as={Link} href="/dashboard">
      Dashboard
    </Button>
  )
}
