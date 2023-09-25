import useSWR from "swr"
import supabase from "@/lib/supabase"

export function useFetchNFTs() {
  return useSWR("useFetchNFTs", async () => {
    try {
      const { data, error } = await supabase.from("nfts").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data
    } catch (error) {
      return []
    }
  })
}
