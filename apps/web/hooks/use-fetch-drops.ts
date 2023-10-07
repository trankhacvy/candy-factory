import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchDrops() {
  const { data: session } = useSession()

  return useSWR(session ? "fetch-drops" : null, () => api.withToken(session?.accessToken).getDrops())
}
