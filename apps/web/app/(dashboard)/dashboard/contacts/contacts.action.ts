"use server"
import * as z from "zod"
import { contactGroupFormSchema } from "@/components/contacts/new-contact-modal"
import supabase from "@/lib/supabase"
import { ServerActionResponse } from "@/types"

export const createContactGroup = async (
  values: z.infer<typeof contactGroupFormSchema>
): Promise<ServerActionResponse<boolean>> => {
  try {
    
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
