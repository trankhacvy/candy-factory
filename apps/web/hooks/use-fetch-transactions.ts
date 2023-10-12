import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchTransactions() {
  const { data: session } = useSession()

  return useSWR(session ? "get-transactions" : null, () => api.withToken(session?.accessToken).getTransactions())
}
