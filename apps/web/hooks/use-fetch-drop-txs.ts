import useSWR from "swr"
import api from "@/lib/api"
import { useSession } from "next-auth/react"
import { PageOptionRequest } from "@/types"

export function useFetchDropTxs(id?: string, request?: PageOptionRequest, refresh = false) {
  const { data: session } = useSession()

  return useSWR(
    session && id ? ["fetch-drops-tx", id, request?.page ?? ""] : null,
    () => api.withToken(session?.accessToken).getDropTransactions(id!, request),
    {
      refreshInterval: refresh ? 2000 : 0,
      keepPreviousData: true,
    }
  )
}
