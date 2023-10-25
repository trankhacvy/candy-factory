import useSWR from "swr"
import qs from "query-string"
import { useSession } from "next-auth/react"
import api from "@/lib/api"
import { PageOptionRequest } from "@/types"

export function useFetchContactGroups(request?: PageOptionRequest) {
  const { data: session } = useSession()

  const { isLoading, ...rest } = useSWR(session ? `/audience-groups?${qs.stringify(request ?? {})}` : null, () =>
    api.withToken(session?.accessToken).getContactGroup(request)
  )

  return {
    ...rest,
    isLoading: !session || isLoading,
  }
}

export function useFetchGroup(groupId?: string) {
  const { data: session } = useSession()

  const { isLoading, ...rest } = useSWR(
    session && groupId ? `/audience-groups/${groupId}` : null,
    () => api.withToken(session?.accessToken).getGroup(groupId!),
    {
      refreshInterval: (data) => (data?.data?.numOfAudience === 0 ? 2000 : 0),
    }
  )

  return {
    ...rest,
    isLoading: isLoading || !session,
  }
}

export function useFetchWallets(groupId: string, request?: PageOptionRequest) {
  const { data: session } = useSession()

  return useSWR(
    session && groupId ? `/audience-groups/${groupId}/wallets?${qs.stringify(request ?? {})}` : null,
    () => api.withToken(session?.accessToken).getWallets(groupId!, request),
    {
      keepPreviousData: true,
      refreshInterval: (data) => (data?.data?.meta.itemCount && data?.data?.meta.itemCount > 0 ? 0 : 2000),
    }
  )
}
