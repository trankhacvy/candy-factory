import { Keypair, PublicKey } from "@solana/web3.js"
import * as bs58 from "bs58"

export function loadMasterWallet() {
  return Keypair.fromSecretKey(bs58.decode(process.env.MASTER_WALLET!))
}

export function validateSolanaPublicKeys(csvData: Array<any>): string[] {
  return csvData
    .map((items) => {
      if (!Array.isArray(items) || items.length === 0) {
        return false
      }

      const wallet = items[0]

      if (typeof wallet !== "string") return false

      const publicKeyRegex = /^[0-9A-Za-z+/]{44}$/

      const testResult = publicKeyRegex.test(wallet)
      return testResult ? wallet : testResult
    })
    .filter(Boolean)
}

export function isPublicKey(val: string) {
  try {
    return !!new PublicKey(val)
  } catch (error) {
    return false
  }
}
