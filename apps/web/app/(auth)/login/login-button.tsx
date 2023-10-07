"use client"

import bs58 from "bs58"
import { getCsrfToken, signIn, useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { SigninMessage } from "@/lib/signin-message"
import { useEffect } from "react"
import ConnectWalletButton from "@/components/connect-wallet-button"
import { useSearchParams } from "next/navigation"

export default function LoginButton() {
  const { data: session, status } = useSession()
  const params = useSearchParams()

  const wallet = useWallet()
  const walletModal = useWalletModal()

  const handleSignIn = async () => {
    try {
      if (!wallet.connected) {
        walletModal.setVisible(true)
      }

      const csrf = await getCsrfToken()
      if (!wallet.publicKey || !csrf || !wallet.signMessage) return

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: wallet.publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      })

      const data = new TextEncoder().encode(message.prepare())
      const signature = await wallet.signMessage(data)
      const serializedSignature = bs58.encode(signature)

      signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        callbackUrl: params.get("callbackUrl") ?? "/dashboard",
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (wallet.connected && status === "unauthenticated") {
      handleSignIn()
    }
  }, [wallet.connected])

  return <ConnectWalletButton />
}
