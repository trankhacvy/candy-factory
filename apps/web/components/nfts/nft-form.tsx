"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { PlusIcon, TrashIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import ConnectWalletButton from "@/components/connect-wallet-button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { IconButton } from "@/components/ui/icon-button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast"
import { Uploader } from "@/components/ui/uploader"
import { Typography } from "../ui/typography"
import { useSession } from "next-auth/react"
import api from "@/lib/api"

export const nftFormSchema = z.object({
  // collection
  // collectionMedia: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
  collectionMedia: z.any().refine((file) => !!file, "Media is required."),
  collectionName: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 32 characters`),
  collectionSymbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(10, `The maximum allowed length for this field is 10 characters`),
  collectionDescription: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(1000, `The maximum allowed length for this field is 200 characters`),
  collectionExternalUrl: z
    .string()
    .trim()
    .max(256, `The maximum allowed length for this field is 256 characters`)
    .optional(),
  //nft
  // media: z.string({ required_error: "This field is required." }).trim().min(1, "This field is required."),
  media: z.any().refine((file) => !!file, "Media is required."),
  name: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(32, `The maximum allowed length for this field is 32 characters`),
  symbol: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(10, `The maximum allowed length for this field is 10 characters`),
  description: z
    .string({ required_error: "This field is required." })
    .trim()
    .min(1, "This field is required.")
    .max(1000, `The maximum allowed length for this field is 200 characters`),
  externalUrl: z.string().trim().max(256, `The maximum allowed length for this field is 256 characters`).optional(),
  collectionAddress: z.string().trim().optional(),
  attributes: z
    .array(
      z.object({
        trait_type: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(10, `The maximum allowed length for this field is 10 characters`),
        value: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(32, `The maximum allowed length for this field is 32 characters`),
      })
    )
    .optional(),
})

export function NewNFTForm() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const { push } = useRouter()
  const { connected, publicKey } = useWallet()

  const form = useForm<z.infer<typeof nftFormSchema>>({
    resolver: zodResolver(nftFormSchema),
    defaultValues: {
      // collection
      collectionName: "",
      collectionSymbol: "",
      collectionDescription: "",
      collectionExternalUrl: "",
      // nft
      name: "",
      symbol: "",
      description: "",
      externalUrl: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  async function onSubmit(values: z.infer<typeof nftFormSchema>) {
    try {
      if (!publicKey) {
        toast({
          variant: "warning",
          title: "Please connect to your wallet",
        })
        return
      }

      const formData = new FormData()
      Object.keys(values).forEach((key) => {
        if (key === "media") {
          console.log(values[key])
          formData.append("image", values[key])
        } else if (key === "collectionMedia") {
          formData.append("collectionImage", values[key])
        } else if (key === "attributes") {
          formData.append("attributes", JSON.stringify(values[key]))
        } else {
          // @ts-ignore
          formData.append(key, values[key])
        }
      })

      // const result = await createNFT(formData)
      const result = await api.withToken(session?.accessToken).createNFT(formData)

      if (result) {
        toast({
          variant: "success",
          title: "Your NFT created successfully",
        })
        push("/dashboard/nfts")
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Unknown error",
        })
      }
    } catch (error: any) {
      toast({
        variant: "error",
        title: "Error :(",
        description: error?.message ?? "Unknown error",
      })
    }
  }

  return (
    <div className="mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6 flex gap-6">
            <div className="basis-1/4">
              <Typography as="h6" className="font-bold">
                Collection
              </Typography>
            </div>
            <div className="basis-3/4">
              <div className="mb-5 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card">
                {/* image */}
                <FormField
                  control={form.control}
                  name="collectionMedia"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[240px]">
                      <FormLabel>Media</FormLabel>
                      <AspectRatio ratio={1 / 1}>
                        <Uploader
                          {...field}
                          className="h-full"
                          maxFiles={1}
                          accept={{
                            "image/png": [".png"],
                            "image/jpeg": [".jpg", ".jpeg"],
                          }}
                          onExceedFileSize={() => form.setError("collectionMedia", { message: "Max file size is 5MB" })}
                          value={field.value ? [field.value] : []}
                          onChange={(files) => {
                            const file = files?.[0] as any
                            if (file) {
                              field.onChange(file)
                              // const reader = new FileReader()
                              // reader.onload = (e) => {
                              //   field.onChange(e.target?.result as string)
                              // }
                              // reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </AspectRatio>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* name */}
                <FormField
                  control={form.control}
                  name="collectionName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Collection name" error={fieldState.invalid} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* symbol */}
                <FormField
                  control={form.control}
                  name="collectionSymbol"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="Collection symbol" error={fieldState.invalid} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* description */}
                <FormField
                  control={form.control}
                  name="collectionDescription"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          as="textarea"
                          rows={6}
                          placeholder="Collection description"
                          error={fieldState.invalid}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* external url */}
                <FormField
                  control={form.control}
                  name="collectionExternalUrl"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>External URL</FormLabel>
                      <FormControl>
                        <Input placeholder="Collection external URL (optional)" error={fieldState.invalid} {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        URI pointing to an external URL defining the asset — e.g. the game&apos;s main site.
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="basis-1/4">
              <Typography as="h6" className="font-bold">
                NFT
              </Typography>
            </div>
            <div className="basis-3/4">
              <div className="mb-5 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card">
                {/* image */}
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }) => (
                    <FormItem className="w-full max-w-[240px]">
                      <FormLabel>Media</FormLabel>
                      <AspectRatio ratio={1 / 1}>
                        <Uploader
                          {...field}
                          className="h-full"
                          maxFiles={1}
                          // accept={{
                          //   "image/png": [".png"],
                          //   "image/jpeg": [".jpg", ".jpeg"],
                          // }}
                          onExceedFileSize={() => form.setError("media", { message: "Max file size is 5MB" })}
                          value={field.value ? [field.value] : []}
                          onChange={(files) => {
                            const file = files?.[0] as any
                            if (file) {
                              field.onChange(file)
                              // const reader = new FileReader()
                              // reader.onload = (e) => {
                              //   field.onChange(e.target?.result as string)
                              // }
                              // reader.readAsDataURL(file)
                            }
                          }}
                        />
                      </AspectRatio>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="NFT name" error={fieldState.invalid} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* symbol */}
                <FormField
                  control={form.control}
                  name="symbol"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Symbol</FormLabel>
                      <FormControl>
                        <Input placeholder="NFT symbol" error={fieldState.invalid} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          as="textarea"
                          rows={6}
                          placeholder="NFT description"
                          error={fieldState.invalid}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* external url */}
                <FormField
                  control={form.control}
                  name="externalUrl"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>External URL</FormLabel>
                      <FormControl>
                        <Input placeholder="External URL (optional)" error={fieldState.invalid} {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        URI pointing to an external URL defining the asset — e.g. the game&apos;s main site.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* attributes */}
                {fields.map((field, index) => (
                  <div className="flex w-full items-center gap-6" key={field.id}>
                    <FormField
                      control={form.control}
                      name={`attributes.${index}.trait_type`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Trait type</FormLabel>
                          <FormControl>
                            <Input fullWidth placeholder="Trait type" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`attributes.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input fullWidth placeholder="Trait value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation()
                        event.preventDefault()
                        remove(index)
                      }}
                      className="shrink-0 self-end"
                    >
                      <TrashIcon />
                    </IconButton>
                  </div>
                ))}

                <Button
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    append({ trait_type: "", value: "" })
                  }}
                  size="sm"
                  endDecorator={<PlusIcon />}
                  className="self-start"
                >
                  Add attributes
                </Button>
              </div>
            </div>
          </div>

          {/* <div className="flex justify-end">
            {connected ? (
              <Button loading={form.formState.isSubmitting} type="submit">
                Create
              </Button>
            ) : (
              <ConnectWalletButton />
            )}
          </div> */}
        </form>
      </Form>
    </div>
  )
}
