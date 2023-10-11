"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useFetchNFTs } from "@/hooks/use-fetch-nfts"
import ConnectWalletButton from "../connect-wallet-button"
import { IconButton } from "../ui/icon-button"
import Image from "../ui/image"
import { Input } from "../ui/input"
import { useToast } from "../ui/toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useFetchContactGroups } from "@/hooks/use-fetch-contact-groups"
import { createDrop } from "@/app/(dashboard)/dashboard/drops.action"
import { mutate } from "swr"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { TopCollections } from "@/utils/top-collections"
import { AspectRatio } from "../ui/aspect-ratio"
import { cn } from "@/utils/cn"

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

const dropFormSchema = z.intersection(walletsFormSchema, baseFormSchema)

export const NewDropModal = ({ trigger }: NewDropModalProps) => {
  const { toast } = useToast()
  const wallet = useWallet()
  const { publicKey } = wallet
  const [open, setIsOpen] = useState(false)
  const { push } = useRouter()

  const { data: nfts } = useFetchNFTs()

  const [tab, setTab] = useState<"group" | "collection">("group")

  const form = useForm<z.infer<typeof dropFormSchema>>({
    resolver: zodResolver(dropFormSchema),
    defaultValues: {
      name: "",
      type: "group",
    },
  })

  const onSubmit = async (values: z.infer<typeof dropFormSchema>) => {
    try {
      console.log(values)

      const { success, data, error } = await createDrop(values)

      if (success) {
        toast({
          variant: "success",
          title: "New drop created successfully",
        })
        await mutate("fetch-drops")
        setIsOpen(false)
        push(`/dashboard/${data?.id}`)
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
    }
  }

  useEffect(() => {
    form.setValue("type", tab)
  }, [tab, form])

  return (
    <>
      <AlertDialog open={open} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-lg overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New Drop</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        {nfts?.data?.data?.map((nft) => (
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
