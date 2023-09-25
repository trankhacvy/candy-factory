import useSWR from "swr"
import supabase from "@/lib/supabase"

export function useFetchCampaigns() {
  return useSWR("useFetchCampaigns", async () => {
    try {
      const { data, error } = await supabase.from('tbl_campaigns').select("*")
      if (error) throw error
      return data
    } catch (error) {
      return []
    }
  })
}
