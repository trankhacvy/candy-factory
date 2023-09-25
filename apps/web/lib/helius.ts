import { Helius } from "helius-sdk"
import { HELIUS_API_KEY, SOLANA_CLUSTER } from "@/config/env"

export default new Helius(HELIUS_API_KEY, SOLANA_CLUSTER)
