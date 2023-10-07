import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchNFTs() {
  const { data: session } = useSession()

  return useSWR(session ? "get-nfts" : null, () => api.withToken(session?.accessToken).getNFTs())
}
