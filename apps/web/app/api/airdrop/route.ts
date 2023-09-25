import { NextResponse } from "next/server"
import { createJob } from "@/jobs/airdrop"
import supabase from "@/lib/supabase"
import { client } from "@/trigger"
import { BaseResponse } from "../type"

export async function POST(req: Request): Promise<NextResponse<BaseResponse<boolean>>> {
  const body = (await req.json()) as { campaignId: string }

  try {
    const campaignId = body.campaignId

    const { data: campaign, error: campaignError } = await supabase
      .from("tbl_campaigns")
      .select("*,nfts:tbl_nfts(*)")
      .eq("id", campaignId)
      .single()

    if (campaignError) return NextResponse.json({ success: false, error: campaignError?.message ?? "Unknown error" })

    const { data: contacts, error: contactError } = await supabase.from("tbl_contacts").select("*")

    if (contactError) return NextResponse.json({ success: false, error: contactError?.message ?? "Unknown error" })

    const event = await client.sendEvent({
      // id: "airdrop",
      name: "airdrop",
      payload: {
        campaignId,
        campaign,
        contacts,
      },
    })

    console.log("event", event)

    return NextResponse.json({ success: true, data: true })
  } catch (error: any) {
    console.log(error?.message)
    return NextResponse.json({ success: false, error: error?.message ?? "Unknown error" })
  }
}
