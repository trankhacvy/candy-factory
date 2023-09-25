import { Network, ShyftSdk } from "@shyft-to/js"
import { SHYFT_API_KEY, SOLANA_CLUSTER } from "@/config/env"

const shyft = new ShyftSdk({
  apiKey: SHYFT_API_KEY,
  network: SOLANA_CLUSTER as Network,
})

export default shyft
