"use client"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { PropsWithChildren, useEffect, useMemo } from "react"
import { SOLANA_CLUSTER, SOLANA_PRC } from "@/config/env"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import api from "@/lib/api"

export function Providers({ children }: { children: React.ReactNode }) {
  const network = SOLANA_CLUSTER as WalletAdapterNetwork

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network])

  return (
    <ConnectionProvider endpoint={SOLANA_PRC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <SessionProvider>
            <Wrapper>{children}</Wrapper>
          </SessionProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

const Wrapper = ({ children }: PropsWithChildren) => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session.error) {
      signOut()
      try {
        api.withToken(session.accessToken).logout()
      } catch (error) {
        // ignore
      }
    }
  }, [session, status])

  return <>{children}</>
}
