import useSWR from "swr"
import helius from "@/lib/helius"

export function useFetchAssetsByOwner(owner?: string) {
  return useSWR(owner ? `getAssetsByOwner/${owner}` : null, () =>
    helius.rpc.getAssetsByOwner({
      ownerAddress: owner!,
      page: 1,
      limit: 20,
    })
  )
}
