import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"
import { PageOptionRequest } from "@/types"

export function useFetchContactGroups() {
  const { data: session } = useSession()

  return useSWR(session ? "get-contact-groups" : null, () => api.withToken(session?.accessToken).getContactGroup())
}

export function useFetchGroup(groupId?: string) {
  const { data: session } = useSession()

  return useSWR(session && groupId ? ["fetch-group", groupId] : null, () =>
    api.withToken(session?.accessToken).getGroup(groupId!)
  )
}

export function useFetchWallets(groupId: string, request?: PageOptionRequest) {
  const { data: session } = useSession()

  return useSWR(
    session && groupId ? ["fetch-wallets", groupId, request?.page ?? ""] : null,
    () => api.withToken(session?.accessToken).getWallets(groupId!, request),
    {
      keepPreviousData: true,
    }
  )
}
