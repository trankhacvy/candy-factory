import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"

export const transferSolTx = (sender: PublicKey, receiver: PublicKey, sol: number) => {
  return new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: receiver,
      lamports: Math.round(sol * LAMPORTS_PER_SOL),
    })
  )
}
