"use server"
import * as z from "zod"
import { ServerActionResponse } from "@/types"
import { formDropSchema } from "@/components/drops/new-drop-modal"
import api from "@/lib/api"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Drop } from "@/types/schema"

export const createDrop = async (values: z.infer<typeof formDropSchema>): Promise<ServerActionResponse<Drop>> => {
  try {
    const session = await getServerSession(authOptions)

    const { statusCode, data, error } = await api.withToken(session?.accessToken).createDrop({
      name: values.name,
      nftId: Number(values.nftId),
      groupId: Number(values.groupId),
    })

    if (statusCode === 201) {
      return {
        success: true,
        data,
      }
    } else {
      return {
        success: false,
        error: error || "Server error",
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Server error",
    }
  }
}
