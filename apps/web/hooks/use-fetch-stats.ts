import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchStats() {
  const { data: session } = useSession()

  const { isLoading, ...rest } = useSWR(session ? "get-stat" : null, () =>
    api.withToken(session?.accessToken).getStat()
  )

  return {
    isLoading: !session || isLoading,
    ...rest,
  }
}
