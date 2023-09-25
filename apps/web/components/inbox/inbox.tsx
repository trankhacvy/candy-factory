"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { MailIcon } from "lucide-react"
import Link from "next/link"
import { useFetchAssetsByOwner } from "@/hooks/use-assets-by-owner"
import NFTItem from "./nft-item"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

export default function Inbox() {
  const { publicKey } = useWallet()
  const { data, isLoading } = useFetchAssetsByOwner(publicKey?.toBase58())

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 overflow-hidden rounded-2xl p-5 shadow-card">
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
        <div className="grid grid-cols-3 gap-8">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl p-6 shadow-card">
      <Typography as="h2" level="h6" className="text-center font-bold">
        Inbox
      </Typography>
      <div className="flex justify-end">
        <Link href="/inbox/queue">
          <Button startDecorator={<MailIcon />}>Queue</Button>
        </Link>
      </div>
      <div className="mt-10 space-y-4">
        {data?.items.map((item) => (
          <NFTItem key={item.id} asset={item} />
        ))}
      </div>
    </div>
  )
}
