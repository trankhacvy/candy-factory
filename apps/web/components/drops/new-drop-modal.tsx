"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useWallet } from "@solana/wallet-adapter-react"
import { XIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
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

type NewDropModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export const formDropSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  nftId: z.string().min(1, { message: "NFT is required" }),
  groupId: z.string().min(1, { message: "Group is required" }),
})

export const NewDropModal = ({ trigger }: NewDropModalProps) => {
  const { toast } = useToast()
  const wallet = useWallet()
  const { publicKey } = wallet
  const [open, setIsOpen] = useState(false)
  const { push } = useRouter()

  const { data: nfts } = useFetchNFTs()
  const { data: audienceGroups } = useFetchContactGroups()

  const form = useForm<z.infer<typeof formDropSchema>>({
    resolver: zodResolver(formDropSchema),
    defaultValues: {
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formDropSchema>) => {
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

  return (
    <>
      <AlertDialog open={open} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-md overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>New Drop</AlertDialogTitle>
          </AlertDialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormItem>
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

              <FormField
                control={form.control}
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
