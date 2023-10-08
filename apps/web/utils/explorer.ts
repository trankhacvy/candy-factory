import { SOLANA_CLUSTER } from "@/config/env"

export function getExplorerUrl(value: string, type: "address" | "signature", isCompressed = false) {
  switch (type) {
    case "signature":
      return `https://translator.shyft.to/tx/${value}?cluster=${SOLANA_CLUSTER}`
    case "address":
      return `https://translator.shyft.to/address/${value}?cluster=${SOLANA_CLUSTER}${
        isCompressed ? "&compressed=true" : ""
      }`
    default:
      return ""
  }
}
