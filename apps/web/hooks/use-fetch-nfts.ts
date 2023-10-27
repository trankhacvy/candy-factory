import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchNFTs() {
  const { data: session } = useSession()

  return useSWR(session ? `/nfts` : null, () => api.withToken(session?.accessToken).getNFTs())
}

export function useFetchNFT(nftId?: number | string) {
  const { data: session } = useSession()

  const { isLoading, ...rest } = useSWR(session && nftId ? `/nfts/${nftId}` : null, () =>
    api.withToken(session?.accessToken).getNFT(nftId as number | string)
  )

  return {
    ...rest,
    isLoading: isLoading || !session,
  }
}
