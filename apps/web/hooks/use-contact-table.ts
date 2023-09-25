import useSWR from "swr"
import supabase from "@/lib/supabase"

export function useFetchContacts() {
  return useSWR("useFetchContacts", async () => {
    try {
      const { data, error } = await supabase.from("audience_groups").select("*,audiences:audiences(*)")
      if (error) throw error
      return data
    } catch (error) {
      return []
    }
  })
}
