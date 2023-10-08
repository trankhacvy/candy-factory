import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchDrops() {
  const { data: session } = useSession()

  return useSWR(session ? "fetch-drops" : null, () => api.withToken(session?.accessToken).getDrops())
}

export function useFetchDrop(dropId?: string) {
  const { data: session } = useSession()

  return useSWR(
    session && dropId ? `fetch-drop/${dropId}` : null,
    () => api.withToken(session?.accessToken).getDrop(dropId!),
    {
      refreshInterval: (data) => {
        const drop = data?.data
        return drop ? (drop.mintedNft < drop.numOfNft ? 2000 : 0) : 0
      },
    }
  )
}
