import useSWR from "swr"
import api from "@/lib/api"
import { useSession } from "next-auth/react"

export function useFetchCampaignTxs(id?: string) {
  const { data: session } = useSession()

  return useSWR(session && id ? "fetch-drops" : null, () =>
    api.withToken(session?.accessToken).getDropTransactions(id!)
  )
}
