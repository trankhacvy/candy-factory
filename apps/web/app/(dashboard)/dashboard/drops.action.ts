"use server"
import * as z from "zod"
import { ServerActionResponse } from "@/types"
import { dropFormSchema } from "@/components/drops/new-drop-modal"
import api from "@/lib/api"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CreateDropDto, CreateTransactionDto, Drop } from "@/types/schema"

export const createDrop = async (
  values: z.infer<typeof dropFormSchema>,
  createTxDto: CreateTransactionDto
): Promise<ServerActionResponse<Drop>> => {
  try {
    const session = await getServerSession(authOptions)

    const {
      statusCode: txStatusCode,
      data: txData,
      error: txError,
    } = await api.withToken(session?.accessToken).createTransaction(createTxDto)
    console.log("txStatusCode", txStatusCode)
    if (txStatusCode !== 201 || !txData) {
      return {
        success: false,
        error: txError ?? "Server error",
      }
    }

    const params: CreateDropDto = {
      name: values.name,
      nftId: Number(values.nftId),
      transactionId: txData.id
    }

    if (values.type === "collection") {
      params.collection = values.collection
    } else {
      params.groupId = Number(values.groupId)
    }

    const { statusCode, data, error } = await api.withToken(session?.accessToken).createDrop(params)

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
