import { NextResponse } from "next/server"
import { client } from "@/trigger"
import { BaseResponse } from "../type"

export async function POST(req: Request): Promise<NextResponse<BaseResponse<boolean>>> {
  //   const body = (await req.json()) as { campaignId: string }

  try {
    // const campaignId = body.campaignId

    const event = await client.sendEvent({
      id: "job1",
      name: "job1",
      payload: {
        userId: "u_1234567890",
      },
    })

    console.log("event", event)

    return NextResponse.json({ success: true, data: true })
  } catch (error: any) {
    console.log(error?.message)
    return NextResponse.json({ success: false, error: error?.message ?? "Unknown error" })
  }
}
