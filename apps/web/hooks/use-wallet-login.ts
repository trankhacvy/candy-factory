import bs58 from "bs58"
import { useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { getCsrfToken, signIn } from "next-auth/react"
import { SigninMessage } from "@/lib/signin-message"
import { useSearchParams } from "next/navigation"

export function useWalletLogin() {
  const params = useSearchParams()
  const { connected, publicKey, signMessage } = useWallet()
  const walletModal = useWalletModal()

  const handleSignIn = useCallback(async () => {
    try {
      if (!connected) {
        walletModal.setVisible(true)
      }

      const csrf = await getCsrfToken()
      if (!publicKey || !csrf || !signMessage) return

      const message = new SigninMessage({
        domain: window.location.host,
        publicKey: publicKey?.toBase58(),
        statement: `Sign this message to sign in to the app.`,
        nonce: csrf,
      })

      const data = new TextEncoder().encode(message.prepare())
      const signature = await signMessage(data)
      const serializedSignature = bs58.encode(signature)

      signIn("credentials", {
        message: JSON.stringify(message),
        signature: serializedSignature,
        callbackUrl: params.get("callbackUrl") ?? "/dashboard",
      })
    } catch (error) {
      console.log(error)
    }
  }, [connected, publicKey, signMessage, params])

  return {
    handleSignIn,
  }
}
