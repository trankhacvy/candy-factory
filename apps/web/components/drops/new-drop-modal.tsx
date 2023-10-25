"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { XIcon, AlertTriangleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm, useFormContext } from "react-hook-form"
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
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFetchNFTs } from "@/hooks/use-fetch-nfts"
import ConnectWalletButton from "../connect-wallet-button"
import { IconButton } from "../ui/icon-button"
import Image from "../ui/image"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useFetchContactGroups } from "@/hooks/use-fetch-contact-groups"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { TopCollections } from "@/utils/top-collections"
import { AspectRatio } from "../ui/aspect-ratio"
import { cn } from "@/utils/cn"
import { Typography } from "../ui/typography"
import { useEstimatePrice } from "@/hooks/use-estimate-price"
import { Skeleton } from "../ui/skeleton"
import { createDrop } from "@/app/(dashboard)/dashboard/drops.action"
import { mutate } from "swr"
import { transferSolTx } from "@/lib/solana"
import { PublicKey } from "@solana/web3.js"
import { MASTER_WALLET } from "@/config/env"
import { formatNumber } from "@/utils/number"
import { NFT } from "@/types/schema"

type NewDropModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const typeEnum = z.enum(["group", "collection"])

export const baseFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  nftId: z.string().min(1, { message: "NFT is required" }),
  type: typeEnum,
})

const fromGroupFormSchema = z.object({
  type: z.literal(typeEnum.enum.group),
  groupId: z.string().min(1, { message: "Group is required" }),
})

const fromCollectionFormSchema = z.object({
  type: z.literal(typeEnum.enum.collection),
  collection: z.string().min(1, { message: "Collection is required" }),
})

const walletsFormSchema = z.discriminatedUnion("type", [fromGroupFormSchema, fromCollectionFormSchema])

export const dropFormSchema = z.intersection(walletsFormSchema, baseFormSchema)

export const NewDropModal = ({ trigger }: NewDropModalProps) => {
  const wallet = useWallet()
  const { publicKey } = wallet
  const [open, setIsOpen] = useState(false)

  const { data: nfts } = useFetchNFTs()

  const grouppedNFTs = useMemo(() => {
    if (nfts) {
      const collectionIds: number[] = []
      const collections: (NFT & { nfts: NFT[] })[] = []

      nfts.data?.data.forEach((nft) => {
        if (collectionIds.includes(nft.collectionId as number)) {
          const collection = collections.find((col) => col.id === (nft.collectionId as number))
          collection?.nfts.push(nft)
        } else {
          collectionIds.push(nft.collectionId as number)
          collections.push({ ...(nft.collection as NFT), nfts: [nft] })
        }
      })

      return collections
    }
    return []
  }, [nfts])

  const [tab, setTab] = useState<"group" | "collection">("group")
  const [step, setStep] = useState<"config" | "review">("config")

  const form = useForm<z.infer<typeof dropFormSchema>>({
    resolver: zodResolver(dropFormSchema),
    defaultValues: {
      name: "",
      type: "group",
    },
  })

  const { watch } = form

  const wNFTId = watch("nftId")
  const wGroupId = watch("groupId")
  const wCollection = watch("collection")

  const onSubmit = async () => {
    setStep("review")
  }

  useEffect(() => {
    form.setValue("type", tab)
  }, [tab, form])

  useEffect(() => {
    if (!open) {
      setTab("group")
      setStep("config")
      form.reset()
    }
  }, [open, setTab, form])

  return (
    <>
      <AlertDialog open={open} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-lg overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {step === "config" && "New Drop"}
              {step === "review" && "Review"}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === "config" && (
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input fullWidth placeholder="eg. New article release" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nftId"
                    render={({ field }) => (
                      <FormItem className="mt-5">
                        <FormLabel>NFT</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the NFT" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {grouppedNFTs.map((item) => (
                              <>
                                <SelectGroup key={item.id}>
                                  <SelectLabel>{item.name}</SelectLabel>
                                  {item.nfts.map((nft) => (
                                    <SelectItem key={nft.id} value={String(nft.id)}>
                                      <div className="!flex items-center gap-3">
                                        <Image
                                          src={nft.image ?? ""}
                                          className="rounded-md"
                                          alt={nft.name ?? ""}
                                          width={32}
                                          height={32}
                                        />
                                        {nft.name}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                                <SelectSeparator />
                              </>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DropsTab value={tab} onValueChange={setTab} />

                  <AlertDialogFooter className="mt-10">
                    {publicKey ? (
                      <Button loading={form.formState.isSubmitting} type="submit" fullWidth>
                        Create
                      </Button>
                    ) : (
                      <ConnectWalletButton />
                    )}
                  </AlertDialogFooter>
                </>
              )}

              {step === "review" && (
                <ReviewStep nftId={wNFTId} groupId={wGroupId} collection={wCollection} setIsOpen={setIsOpen} />
              )}
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

const DropsTab = ({ value, onValueChange }: any) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full mt-5">
      <TabsList
        style={{
          boxShadow: "rgba(145, 158, 171, 0.08) 0px -2px 0px 0px inset",
        }}
        className="grid w-full grid-cols-2"
      >
        <TabsTrigger value="group">Wallet group</TabsTrigger>
        <TabsTrigger value="collection">Collection</TabsTrigger>
      </TabsList>
      <TabsContent value="group">
        <GroupTab />
      </TabsContent>
      <TabsContent value="collection">
        <CollectionTab />
      </TabsContent>
    </Tabs>
  )
}

const GroupTab = () => {
  const { data: audienceGroups } = useFetchContactGroups()

  const { control } = useFormContext<z.infer<typeof dropFormSchema>>()

  return (
    <FormField
      control={control}
      name="groupId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Group</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select the Group" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {audienceGroups?.data?.data?.map((group) => (
                <SelectItem key={group.id} value={String(group.id)}>
                  {group.name} - {group.numOfAudience} wallets
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const CollectionTab = () => {
  const { control, setValue, watch } = useFormContext<z.infer<typeof dropFormSchema>>()

  const wCollection = watch("collection")

  return (
    <FormField
      control={control}
      name="collection"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>Collection</FormLabel>
          <FormControl>
            <Input fullWidth placeholder="eg. 0x00" {...field} />
          </FormControl>
          <FormMessage />
          <div className="grid w-full grid-cols-3 gap-4 pt-4">
            {TopCollections.map((col) => (
              <button
                onClick={(event) => {
                  event.preventDefault()
                  setValue("collection", col.address)
                }}
                key={col.address}
                className={cn("rounded-2xl relative overflow-hidden p-1.5 border-2", {
                  "border-black": col.address === wCollection,
                  "border-gray-500/16": col.address !== wCollection,
                })}
              >
                <AspectRatio>
                  <Image className="w-full h-auto rounded-xl" src={col.image} alt={col.name} fill />
                </AspectRatio>
              </button>
            ))}
          </div>
        </FormItem>
      )}
    />
  )
}

const ReviewStep = ({ setIsOpen, nftId, groupId, collection }: any) => {
  const [loading, setLoading] = useState(false)
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { getValues } = useFormContext<z.infer<typeof dropFormSchema>>()
  const { toast } = useToast()
  const { push } = useRouter()
  const { data: nfts } = useFetchNFTs()

  const nft = nfts?.data?.data.find((nft) => String(nft.id) === nftId)

  const { data, isLoading, isValidating } = useEstimatePrice(groupId ? Number(groupId) : undefined, collection)

  const onSubmit = async () => {
    try {
      if (!publicKey || !data?.data?.price) return

      setLoading(true)
      const tx = transferSolTx(publicKey, new PublicKey(MASTER_WALLET), data.data.price)

      const signature = await sendTransaction(tx, connection)

      await connection.confirmTransaction(signature, "processed")

      const {
        success,
        data: drop,
        error,
      } = await createDrop(getValues(), {
        signature,
        amount: data.data.price,
        sender: publicKey.toBase58(),
      })

      if (success) {
        toast({
          variant: "success",
          title: "New drop created successfully",
        })
        await mutate("fetch-drops")
        setIsOpen(false)
        push(`/dashboard/${drop?.id}`)
      } else {
        toast({
          variant: "error",
          title: error,
        })
      }
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "error",
        title: error?.message ?? "Server error",
      })
    } finally {
      setLoading(false)
    }
  }

  console.log("isLoading && collection", isLoading && collection)

  return (
    <div className="space-y-5">
      <div className="flex justify-center">
        <Image className="rounded-xl" src={nft?.image ?? ""} width={120} height={120} alt={nft?.name ?? ""} />
      </div>
      <div className="flex justify-between">
        <Typography level="body4" color="secondary">
          NFT
        </Typography>
        <Typography className="font-semibold">{nft?.name}</Typography>
      </div>
      <div className="flex justify-between">
        <Typography level="body4" color="secondary">
          Wallets
        </Typography>
        {isLoading || isValidating ? (
          <Skeleton className="w-20 h-4 rounded-md" />
        ) : (
          <Typography className="font-semibold">{formatNumber(data?.data?.totalWallets ?? 0)}</Typography>
        )}
      </div>
      <div className="flex justify-between">
        <Typography level="body4" color="secondary">
          Est price
        </Typography>
        {isLoading || isValidating ? (
          <Skeleton className="w-20 h-4 rounded-md" />
        ) : (
          <Typography className="font-semibold flex gap-2">
            <SolanaIcon /> {data?.data?.price}
          </Typography>
        )}
      </div>

      {isLoading && collection && (
        <Alert variant="warning">
          <AlertIcon>
            <AlertTriangleIcon />
          </AlertIcon>
          <div>
            <AlertDescription>
              It will take some time to estimate the price depending on the number of holders of the collection. Please
              wait.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {!isLoading && !isValidating && (
        <Alert variant="warning">
          <AlertIcon>
            <AlertTriangleIcon />
          </AlertIcon>
          <div>
            <AlertDescription>
              Please review the details of your drop before creating it. You will be asked to pay a transaction fee to
              create the airdrop.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {publicKey ? (
        <Button
          onClick={onSubmit}
          loading={loading}
          disabled={isLoading || isValidating || loading}
          type="submit"
          fullWidth
        >
          Submit
        </Button>
      ) : (
        <ConnectWalletButton />
      )}
    </div>
  )
}

const SolanaIcon = () => (
  <svg viewBox="0 0 32 32" focusable="false" className="w-5 h-5">
    <path
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22.0273 11.75H7.18487C7.14817 11.7495 7.11243 11.7382 7.08208 11.7176C7.05172 11.6969 7.0281 11.6678 7.01412 11.6339C7.00015 11.6 6.99644 11.5627 7.00346 11.5266C7.01048 11.4906 7.02792 11.4574 7.05362 11.4312L10.3161 8.165C10.4233 8.05994 10.5672 8.00076 10.7173 8H25.5598C25.5965 8.00052 25.6322 8.01179 25.6626 8.03243C25.6929 8.05306 25.7165 8.08215 25.7305 8.11609C25.7445 8.15003 25.7482 8.18732 25.7412 8.22335C25.7342 8.25937 25.7167 8.29254 25.691 8.31875L22.4285 11.585C22.3213 11.69 22.1774 11.7492 22.0273 11.75ZM22.0273 23.0002H7.18487C7.14817 22.9997 7.11243 22.9884 7.08208 22.9678C7.05172 22.9472 7.0281 22.9181 7.01412 22.8841C7.00015 22.8502 6.99644 22.8129 7.00346 22.7769C7.01048 22.7409 7.02792 22.7077 7.05362 22.6815L10.3161 19.4152C10.4233 19.3102 10.5672 19.251 10.7173 19.2502H25.5598C25.5965 19.2508 25.6322 19.262 25.6626 19.2827C25.6929 19.3033 25.7165 19.3324 25.7305 19.3663C25.7445 19.4003 25.7482 19.4376 25.7412 19.4736C25.7342 19.5096 25.7167 19.5428 25.691 19.569L22.4285 22.8352C22.3213 22.9403 22.1774 22.9995 22.0273 23.0002ZM25.5598 17.375H10.7173C10.5672 17.3742 10.4233 17.315 10.3161 17.21L7.05362 13.9437C7.02792 13.9175 7.01048 13.8844 7.00346 13.8483C6.99644 13.8123 7.00015 13.775 7.01412 13.7411C7.0281 13.7072 7.05172 13.6781 7.08208 13.6574C7.11243 13.6368 7.14817 13.6255 7.18487 13.625H22.0273C22.1774 13.6258 22.3213 13.6849 22.4285 13.79L25.691 17.0562C25.7167 17.0824 25.7342 17.1156 25.7412 17.1516C25.7482 17.1877 25.7445 17.225 25.7305 17.2589C25.7165 17.2928 25.6929 17.3219 25.6626 17.3426C25.6322 17.3632 25.5965 17.3745 25.5598 17.375Z"
    ></path>
  </svg>
)
