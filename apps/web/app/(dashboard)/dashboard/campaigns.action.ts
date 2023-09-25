"use server"
import * as z from "zod"
import supabase from "@/lib/supabase"
import { ServerActionResponse } from "@/types"
import { formCampaignSchema } from "@/components/campaign/new-campaign-modal"
import { client } from "@/trigger"

export const createCampaign = async (
  values: z.infer<typeof formCampaignSchema>
): Promise<ServerActionResponse<boolean>> => {
  try {
    const { data, error } = await supabase
      .from("audience_groups")
      .select("*,audiences:audiences(*)")
      .eq("id", values.groupId)
      .single()

    if (error) {
      return {
        success: false,
        error: error?.message || "Server error",
      }
    }

    const audiences = data.audiences ?? []

    const event = await client.sendEvent({
      //   id: "airdropToken",
      name: "airdropToken",
      payload: {
        audiences,
      },
    })

    console.log("event: ", event.id)

    return {
      success: true,
      data: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Server error",
    }
  }
}
