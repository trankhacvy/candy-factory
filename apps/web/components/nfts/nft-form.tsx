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
import { PatternFormat, NumericFormat, NumberFormatBase } from "react-number-format"
import { useEffect } from "react"
import { isPublicKey } from "@/utils/keypair"

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
    .max(200, `The maximum allowed length for this field is 200 characters`),
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
    .max(200, `The maximum allowed length for this field is 200 characters`),
  externalUrl: z.string().trim().max(256, `The maximum allowed length for this field is 256 characters`).optional(),
  collectionAddress: z.string().trim().optional(),
  royalty: z
    .number({ required_error: "This field is required." })
    .min(0, "The royalty must be greater than or equal to 0.")
    .max(100, "The royalty must not exceed 100."),

  creators: z
    .array(
      z.object({
        address: z
          .string({ required_error: "This field is required." })
          .trim()
          .min(1, "This field is required.")
          .max(44, `The maximum allowed length for this field is 44 characters`)
          .refine((val) => isPublicKey(val), {
            message: "Invalid wallet",
          }),
        share: z
          .number({ required_error: "This field is required." })
          .min(0, "The share must be greater than or equal to 0.")
          .max(100, "The share must not exceed 100."),
      })
    )
    .optional()
    .superRefine((values, ctx) => {
      if (values) {
        const hasInvalidWallet = values.some((val) => !isPublicKey(val.address))
        if (hasInvalidWallet) {
          values.forEach((val, idx) => {
            if (!isPublicKey(val.address)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Invalid wallet address`,
                path: [idx, "wallet"],
              })
            }
          })
          return
        }

        const wallets = values.map((val) => val.address)
        const uniqueWallets = Array.from(new Set(values.map((val) => val.address)))

        if (uniqueWallets.length < wallets.length) {
          const uniqueWalletsArr: string[] = []
          values.forEach((value, index) => {
            if (uniqueWalletsArr.includes(value.address)) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `All addresses must be unique`,
                path: [index, "wallet"],
              })
            } else {
              uniqueWalletsArr.push(value.address)
            }
          })

          return
        }

        const totalShare = values.reduce((prev, cur) => prev + cur.share, 0)
        if (totalShare > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Part of the royalties remained undivided. You must distribute all 100%`,
            path: [values.length - 1, "share"],
          })
        }
      }
    }),

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
      royalty: 0,
    },
  })

  const wCreators = form.watch("creators")

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attributes",
  })

  const {
    fields: creatorFields,
    append: appendCreator,
    remove: removeCreator,
  } = useFieldArray({
    control: form.control,
    name: "creators",
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
        } else if (key === "creators") {
          formData.append("creators", JSON.stringify(values[key]))
        } else {
          // @ts-ignore
          formData.append(key, values[key])
        }
      })

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

  useEffect(() => {
    if (session) {
      form.reset({
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
        royalty: 0,
        creators: [
          {
            address: session.user.wallet,
            share: 100,
          },
        ],
      })
    }
  }, [session])

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
                      {/* <FormDescription>Maximum character limit is 32</FormDescription> */}
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
                        <Input
                          placeholder="Enter the website or link to your project"
                          error={fieldState.invalid}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                        <Input
                          placeholder="Enter the website or link to your project"
                          error={fieldState.invalid}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="basis-1/4">
              <Typography as="h6" className="font-bold">
                Royalties
              </Typography>
            </div>
            <div className="basis-3/4">
              <div className="mb-5 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card">
                {/* royalty */}
                <FormField
                  control={form.control}
                  name="royalty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Sales Royalties</FormLabel>
                      <FormControl>
                        <NumericFormat
                          customInput={Input}
                          suffix="%"
                          valueIsNumericString
                          value={field.value}
                          onBlur={field.onBlur}
                          onValueChange={(values) => {
                            field.onChange(values.floatValue)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        The percentage of future sales that will be sent to the creators of this NFT.
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
                Creators
              </Typography>
            </div>
            <div className="basis-3/4">
              <div className="mb-5 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card">
                {/* creators */}
                <div className="space-y-2">
                  <Typography as="label" className="font-medium">
                    Creator Splits
                  </Typography>
                  <Typography as="p" level="body4" color="secondary">
                    You can split the royalties for this NFT among multiple creators. Each percentage will be
                    automatically deposited into each creator’s wallet.
                  </Typography>
                </div>
                {creatorFields.map((field, index) => (
                  <div className="space-y-2" key={field.id}>
                    <div className="flex w-full items-start gap-6">
                      <FormField
                        control={form.control}
                        name={`creators.${index}.address`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Wallet</FormLabel>
                            <FormControl>
                              <Input fullWidth disabled={index === 0} placeholder="Wallet" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`creators.${index}.share`}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Royalty Percentage</FormLabel>
                            <FormControl>
                              <NumericFormat
                                customInput={Input}
                                suffix="%"
                                valueIsNumericString
                                value={field.value}
                                onBlur={field.onBlur}
                                onValueChange={(values) => {
                                  console.log("x", values.floatValue)
                                  field.onChange(values.floatValue)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <IconButton
                        onClick={(event) => {
                          event.stopPropagation()
                          event.preventDefault()
                          removeCreator(index)
                        }}
                        className="shrink-0 self-center"
                        disabled={index === 0}
                      >
                        <TrashIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={(event) => {
                    event.stopPropagation()
                    event.preventDefault()
                    appendCreator({ address: "", share: 0 })
                  }}
                  size="sm"
                  endDecorator={<PlusIcon />}
                  className="self-start"
                  disabled={wCreators && wCreators.length === 4}
                >
                  Add creator
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="basis-1/4">
              <Typography as="h6" className="font-bold">
                Properties
              </Typography>
            </div>
            <div className="basis-3/4">
              <div className="mb-5 flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-card">
                {/* attributes */}
                {fields.map((field, index) => (
                  <div className="flex w-full items-start gap-6" key={field.id}>
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
                      className="shrink-0 self-center"
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
                  Add property
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            {connected ? (
              <Button loading={form.formState.isSubmitting} type="submit">
                Create
              </Button>
            ) : (
              <ConnectWalletButton />
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
