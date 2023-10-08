"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { XIcon } from "lucide-react"
import CSVReader from "react-csv-reader"
import { useForm } from "react-hook-form"
import { mutate } from "swr"
import * as z from "zod"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { validateSolanaPublicKeys } from "@/utils/keypair"
import ConnectWalletButton from "../connect-wallet-button"
import { IconButton } from "../ui/icon-button"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"
import api from "@/lib/api"
import { useSession } from "next-auth/react"

type NewAddressesGroupModalProps = {
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
  csv: z.any().refine((file) => !!file, "Csv file is required."),
})

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_"),
}

export const NewAddressesGroupModal = ({ trigger, isOpen, onOpenChange }: NewAddressesGroupModalProps) => {
  const { toast } = useToast()
  const { data: session } = useSession()
  const wallet = useWallet()
  const { publicKey } = wallet

  const form = useForm<z.infer<typeof contactGroupFormSchema>>({
    resolver: zodResolver(contactGroupFormSchema),
    defaultValues: {
      name: "",
    },
  })

  const { setError, clearErrors } = form

  const onSubmit = async (values: z.infer<typeof contactGroupFormSchema>) => {
    try {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("isFavorite", "false")
      formData.append("file", values.csv)

      const { statusCode, error } = await api.withToken(session?.accessToken).createGroupWithCsv(formData)

      if (statusCode === 201) {
        toast({
          variant: "success",
          title: "New contact created successfully",
        })
        await mutate("get-contact-groups")
        onOpenChange?.(false)
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: error || "Unknown error",
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
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-lg overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New addresses group</AlertDialogTitle>
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
                name="csv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallets</FormLabel>
                    <FormControl>
                      <CSVReader
                        onFileLoaded={(data, _, originalFile) => {
                          if (!data || data.length === 0) {
                            setError("csv", { type: "custom", message: "Invalid CSV file content" })
                            return
                          }

                          const header = data[0]

                          if (!Array.isArray(header) || header.length !== 1) {
                            setError("csv", {
                              type: "custom",
                              message: "Please upload a CSV file with only one column.",
                            })
                            return
                          }

                          clearErrors("csv")

                          const wallets = validateSolanaPublicKeys(data)
                          console.log("wallets", wallets.length)
                          field.onChange(originalFile)
                        }}
                        parserOptions={papaparseOptions}
                      />
                    </FormControl>
                    <FormMessage />

                    <FormDescription>
                      Upload a CSV or TSV file. The first row should be the headers of the table, and your headers
                      should not include any special characters other than hyphens (-) or underscores(_)
                    </FormDescription>
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
