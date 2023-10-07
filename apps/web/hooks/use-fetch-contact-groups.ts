import useSWR from "swr"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export function useFetchContactGroups() {
  const { data: session } = useSession()

  return useSWR(session ? "get-contact-groups" : null, () => api.withToken(session?.accessToken).getContactGroup())
}
