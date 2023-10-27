import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useEstimatePrice(groupId?: number, collection?: string) {
  const { data: session } = useSession()

  const { isLoading, ...rest } = useSWR(
    session && (groupId || collection) ? "estimate-price" : null,
    () =>
      api.withToken(session?.accessToken).estimateDropPrice({
        groupId,
        collection,
      }),
    {
      keepPreviousData: false,
      revalidateOnFocus: false,
    }
  )

  return {
    ...rest,
    isLoading: isLoading || !session,
  }
}
