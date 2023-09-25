"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { DAS } from "helius-sdk"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import helius from "@/lib/helius"
import { cn } from "@/utils/cn"
import { placeholderBlurhash } from "@/utils/image"
import { IconButton } from "../ui/icon-button"
import Image from "../ui/image"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

function useFetchAssetsByOwner(owner?: string) {
  return useSWR(owner ? `getAssetsByOwner/${owner}` : null, () =>
    helius.rpc.getAssetsByOwner({
      ownerAddress: owner!,
      page: 3,
      limit: 6,
    })
  )
}

export default function Queue() {
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
        Queue
      </Typography>
      <div className="mt-10 space-y-4">
        {data?.items.map((item) => (
          <NFTItem key={item.id} asset={item} />
        ))}
      </div>
    </div>
  )
}

type NFTItemProps = {
  read?: boolean
  asset: DAS.GetAssetResponse
}

function NFTItem({ read, asset }: NFTItemProps) {
  const image = asset.content?.files?.find((file) => file.mime?.toLocaleLowerCase().startsWith("image/"))

  return (
    <Link href={`/inbox/${asset.id}`}>
      <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-500/8">
        <div className="flex items-center gap-2 rounded-2xl bg-gray-500/16 p-4">
          <IconButton color="primary">
            <ThumbsUpIcon />
          </IconButton>

          <IconButton color="error">
            <ThumbsDownIcon />
          </IconButton>
        </div>
        <Image
          src={image?.uri ?? ""}
          width={48}
          height={48}
          alt="nft"
          className="overflow-hidden rounded-full object-cover"
          blurDataURL={placeholderBlurhash}
        />
        <div className="flex-1">
          <Typography as="h6" className="font-semibold">
            {asset.content?.metadata.name}
          </Typography>
          <Typography
            level="body4"
            color={read ? "secondary" : undefined}
            className={cn("line-clamp-1", {
              "font-semibold": !read,
            })}
          >
            {asset.content?.metadata.description}
          </Typography>
        </div>
        <div className="flex flex-col items-end gap-3">
          {!read && <span className="h-2 w-2 rounded-full bg-primary-500" />}
        </div>
      </div>
    </Link>
  )
}
