"use client"

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { useMemo } from "react"
import { SOLANA_CLUSTER, SOLANA_PRC } from "@/config/env"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

export function Providers({ children }: { children: React.ReactNode }) {
  const network = SOLANA_CLUSTER as WalletAdapterNetwork

  const wallets = useMemo(() => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })], [network])

  return (
    <ConnectionProvider endpoint={SOLANA_PRC}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
