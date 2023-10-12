import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useEstimatePrice(groupId?: number, collection?: string) {
  const { data: session } = useSession()

  return useSWR(session ? "estimate-price" : null, () =>
    api.withToken(session?.accessToken).estimateDropPrice({
      groupId,
      collection,
    })
  )
}
