"use server"
import * as z from "zod"
import { contactGroupFormSchema } from "@/components/contacts/new-contact-modal"
import supabase from "@/lib/supabase"
import { ServerActionResponse } from "@/types"

export const createContactGroup = async (
  values: z.infer<typeof contactGroupFormSchema>
): Promise<ServerActionResponse<boolean>> => {
  try {
    const { data, error } = await supabase
      .from("audience_groups")
      .insert({
        name: values.name ?? "",
      })
      .select("*")
      .single()

    if (error) throw error

    const { error: error1 } = await supabase.from("audiences").insert(
      values.wallets.map((wallet) => ({
        group_id: data.id,
        wallet,
      }))
    )

    if (error1) throw error1

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
