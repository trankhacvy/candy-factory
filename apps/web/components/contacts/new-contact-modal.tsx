"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { XIcon } from "lucide-react"
import CSVReader from "react-csv-reader"
import { useForm } from "react-hook-form"
import { mutate } from "swr"
import * as z from "zod"
import { createContactGroup } from "@/app/(dashboard)/dashboard/contacts/contacts.action"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { validateSolanaPublicKeys } from "@/utils/keypair"
import ConnectWalletButton from "../connect-wallet-button"
import { IconButton } from "../ui/icon-button"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"

type NewTierDialogProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const contactGroupFormSchema = z.object({
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 100 characters`),
  wallets: z.array(z.string().trim().length(44, "Invalid wallet address")),
})

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_"),
}

export const NewContactModal = ({ trigger, isOpen, onOpenChange }: NewTierDialogProps) => {
  const { toast } = useToast()
  const wallet = useWallet()
  const { publicKey } = wallet

  const form = useForm<z.infer<typeof contactGroupFormSchema>>({
    resolver: zodResolver(contactGroupFormSchema),
    defaultValues: {
      name: "",
      wallets: [] as string[],
    },
  })

  const onSubmit = async (values: z.infer<typeof contactGroupFormSchema>) => {
    try {
      const result = await createContactGroup(values)

      if (result.success) {
        toast({
          variant: "success",
          title: "New contact created successfully",
        })
        await mutate("useFetchContacts")
        onOpenChange?.(false)
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: result.error || "Unknown error",
        })
      }
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    }
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-md overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New contact group</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group name</FormLabel>
                    <FormControl>
                      <Input fullWidth placeholder="eg. Vip members" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wallets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallets</FormLabel>
                    <FormControl>
                      <CSVReader
                        onFileLoaded={(data) => {
                          const wallets = validateSolanaPublicKeys(data)
                          field.onChange(wallets)
                        }}
                        parserOptions={papaparseOptions}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <AlertDialogFooter>
                {publicKey ? (
                  <Button loading={form.formState.isSubmitting} type="submit" fullWidth>
                    Create
                  </Button>
                ) : (
                  <ConnectWalletButton />
                )}
              </AlertDialogFooter>
            </form>
          </Form>

          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 !shadow-none hover:bg-gray-800/8 focus:ring-0"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </IconButton>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
