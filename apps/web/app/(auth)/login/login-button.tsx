"use client"

import { useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import ConnectWalletButton from "@/components/connect-wallet-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useWalletLogin } from "@/hooks/use-wallet-login"

export default function LoginButton() {
  const { status } = useSession()

  const wallet = useWallet()
  const { handleSignIn } = useWalletLogin()

  if (!wallet.connected) {
    return <ConnectWalletButton>Launch Airdrop Now</ConnectWalletButton>
  }

  if (status === "unauthenticated" || status === "loading") {
    return (
      <Button fullWidth onClick={handleSignIn}>
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
