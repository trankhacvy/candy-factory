"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { AlertTriangleIcon, XIcon } from "lucide-react"
import CSVReader from "react-csv-reader"
import { useForm, useFormContext } from "react-hook-form"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { validateSolanaPublicKeys } from "@/utils/keypair"
import ConnectWalletButton from "../connect-wallet-button"
import { IconButton } from "../ui/icon-button"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"
import api from "@/lib/api"
import { useSession } from "next-auth/react"
import { Typography } from "../ui/typography"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertIcon } from "../ui/alert"

type NewAddressesGroupModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const typeEnum = z.enum(["csv", "collection"])

export const baseFormSchema = z.object({
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 100 characters`),
  type: typeEnum,
})

const byCsvFormSchema = z.object({
  type: z.literal(typeEnum.enum.csv),
  csv: z.any().refine((file) => !!file, "Csv file is required."),
})

const byCollectionFormSchema = z.object({
  type: z.literal(typeEnum.enum.collection),
  collection: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
})

const methodsFormSchema = z.discriminatedUnion("type", [byCsvFormSchema, byCollectionFormSchema])

const walletGroupFormSchema = z.intersection(methodsFormSchema, baseFormSchema)

const papaparseOptions = {
  header: false,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_"),
}

export const NewAddressesGroupModal = ({ trigger, isOpen, onOpenChange }: NewAddressesGroupModalProps) => {
  const { toast } = useToast()
  const { push } = useRouter()
  const { data: session } = useSession()
  const wallet = useWallet()
  const { publicKey } = wallet

  const [tab, setTab] = useState<"csv" | "collection">("csv")

  const form = useForm<z.infer<typeof walletGroupFormSchema>>({
    resolver: zodResolver(walletGroupFormSchema),
    defaultValues: {
      name: "",
    },
  })

  const { reset, setValue } = form

  const onSubmit = async (values: z.infer<typeof walletGroupFormSchema>) => {
    try {
      let result
      if (values.type === "csv") {
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("isFavorite", "false")
        // @ts-ignore
        formData.append("file", values.csv)

        result = await api.withToken(session?.accessToken).createGroupWithCsv(formData)
      } else {
        result = await api.withToken(session?.accessToken).createGroupWithCollection({
          name: values.name ?? "",
          // @ts-ignore
          collection: values.collection ?? "",
        })
      }

      const { statusCode, data, error } = result

      if (statusCode === 201 && data) {
        toast({
          variant: "success",
          title: "New contact created successfully",
        })
        await mutate("get-contact-groups")
        onOpenChange?.(false)

        onOpenChange?.(false)
        push(`/dashboard/wallets/${data?.id}`)
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

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  useEffect(() => {
    setValue("type", tab)
  }, [tab])

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-lg overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New wallets group</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormLabel>Group name</FormLabel>
                    <FormControl>
                      <Input fullWidth placeholder="eg. Vip members" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <GroupTabs value={tab} onValueChange={setTab} />

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

const GroupTabs = ({ value, onValueChange }: any) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="csv">Upload CSV file</TabsTrigger>
        <TabsTrigger value="collection">Load collection holders</TabsTrigger>
      </TabsList>
      <TabsContent value="csv">
        <UploadCSVTab />
      </TabsContent>
      <TabsContent value="collection">
        <LoadCollectionHolders />
      </TabsContent>
    </Tabs>
  )
}

const UploadCSVTab = () => {
  const [wallets, setWallets] = useState<string[]>([])

  const { setError, clearErrors, reset, control } = useFormContext<z.infer<typeof walletGroupFormSchema>>()

  return (
    <FormField
      control={control}
      name="csv"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <label className="flex relative flex-col cursor-pointer items-center px-4 py-6 bg-white border border-gray-500/20 border-dashed p-6 rounded-2xl">
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base leading-normal">Select a file</span>
              <CSVReader
                onFileLoaded={(data, _, originalFile) => {
                  if (!data || data.length === 0) {
                    setWallets([])
                    setError("csv", { type: "custom", message: "Invalid CSV file content" })
                    return
                  }

                  const header = data[0]

                  if (!Array.isArray(header) || header.length !== 1) {
                    setError("csv", {
                      type: "custom",
                      message: "Please upload a CSV file with only one column.",
                    })
                    setWallets([])
                    return
                  }

                  clearErrors("csv")

                  const wallets = validateSolanaPublicKeys(data)
                  setWallets(wallets)
                  console.log("wallets", wallets.length)
                  field.onChange(originalFile)
                }}
                parserOptions={papaparseOptions}
                cssClass="absolute inset-0"
                cssInputClass="hidden absolute z-[-1] inset-0"
              />
            </label>
          </FormControl>

          {wallets && wallets.length > 0 && (
            <Typography className="font-semibold" level="body4" as="p" color="info">
              Loaded {wallets.length} wallets
            </Typography>
          )}
          <FormMessage />

          <Alert className="mt-5" variant="warning">
            <AlertIcon>
              <AlertTriangleIcon />
            </AlertIcon>
            <div>
              <AlertDescription>
                Upload a CSV. The first row should be the headers of the table, and your headers should not include any
                special characters other than hyphens (<code>-</code>) or underscores(<code>_</code>)
                <a
                  className="font-semibold underline block"
                  href="https://gist.githubusercontent.com/trankhacvy/ddf5cc9aa3085873e9324ca728b43372/raw/7b728e01ef06c5d3d935b5eb49f19fafcdb6f769/SampleWallet.csv"
                  target="_blank"
                >
                  Sample file
                </a>
              </AlertDescription>
            </div>
          </Alert>
        </FormItem>
      )}
    />
  )
}

const LoadCollectionHolders = () => {
  const { control } = useFormContext<z.infer<typeof walletGroupFormSchema>>()

  return (
    <FormField
      control={control}
      name="collection"
      render={({ field }) => (
        <FormItem className="mb-5">
          <FormLabel>Collection address</FormLabel>
          <FormControl>
            <Input fullWidth placeholder="eg. J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
