import { Cluster } from "@solana/web3.js"

// solana
export const SOLANA_CLUSTER = process.env.NEXT_PUBLIC_SOLANA_CLUSTER as Cluster
export const SOLANA_PRC = process.env.NEXT_PUBLIC_SOLANA_RPC!

export const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY!

export const SHYFT_API_KEY = process.env.SHYFT_API_KEY!

export const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY!

// supabase
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SUPABASE_API_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// keys
export const MASTER_TREE = process.env.MASTER_TREE!

// api
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API!
