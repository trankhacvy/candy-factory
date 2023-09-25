import useSWR from "swr"
import supabase from "@/lib/supabase"

export function useFetchCampaignTxs(id?: string) {
  return useSWR(id ? ["useFetchCampaignTxs", id] : null, async () => {
    try {
      const { data, error } = await supabase
        .from("tbl_campaign_transactions")
        .select("*")
        .eq("campaign_id", id ?? "")
      if (error) throw error
      return data
    } catch (error) {
      return []
    }
  })
}
