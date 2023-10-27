"use client"

import { XIcon } from "lucide-react"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { IconButton } from "@/components/ui/icon-button"
import { useFetchNFT } from "@/hooks/use-fetch-nfts"
import { AspectRatio } from "../ui/aspect-ratio"
import Image from "../ui/image"
import { Typography } from "../ui/typography"
import { Skeleton } from "../ui/skeleton"
import { formatNumber } from "@/utils/number"

type NFTDetailModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  nftId?: number | string
}

export const NFTDetailModal = ({ trigger, isOpen, onOpenChange, nftId }: NFTDetailModalProps) => {
  const { data, isLoading } = useFetchNFT(isOpen ? nftId : undefined)
  const nft = data?.data

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-2xl overflow-auto">
          <div className="flex gap-5">
            {isLoading ? (
              <>
                <div className="flex-[40%]">
                  <AspectRatio className="rounded-2xl overflow-hidden">
                    <Skeleton className="w-full h-full" />
                  </AspectRatio>
                </div>
                <div className="flex-[60%]">
                  <Skeleton className="w-1/3 h-6 rounded-md" />
                  <Skeleton className="w-2/3 h-4 rounded-md mt-2" />
                  <Skeleton className="w-full h-4 rounded-md mt-1" />
                  <Skeleton className="w-2/3 h-4 rounded-md mt-1" />
                </div>
              </>
            ) : (
              <>
                <div className="flex-[40%]">
                  <AspectRatio className="rounded-2xl overflow-hidden">
                    <Image src={nft?.image ?? ""} alt={nft?.name ?? ""} fill />
                  </AspectRatio>
                </div>
                <div className="flex-[60%]">
                  <Typography as="h3" level="body1" className="font-bold mr-6">
                    {nft?.name}
                  </Typography>
                  <Typography color="secondary" level="body4" as="p" className="mt-2">
                    {nft?.description}
                  </Typography>
                  <div className="mt-6 space-y-4">
                    <div className="flex gap-4">
                      <Typography as="h6" level="body4" className="font-semibold flex-1">
                        Symbol
                      </Typography>
                      <Typography as="p" level="body4" color="secondary">
                        {nft?.symbol}
                      </Typography>
                    </div>
                    <div className="flex gap-4">
                      <Typography as="h6" level="body4" className="font-semibold flex-1">
                        External URL
                      </Typography>
                      <a target="_blank" className="underline" href={nft?.externalUrl}>
                        <Typography as="p" level="body4" color="secondary">
                          {nft?.externalUrl}
                        </Typography>
                      </a>
                    </div>
                    <div className="flex gap-4">
                      <Typography as="h6" level="body4" className="font-semibold flex-1">
                        Royalties
                      </Typography>
                      <Typography as="p" level="body4" color="secondary">
                        {/* @ts-ignore */}
                        {formatNumber(nft?.royalty ?? 0)}%
                      </Typography>
                    </div>
                    {/* <div className="flex gap-4">
                      <Typography as="h6" level="body4" className="font-semibold flex-1">
                        Collection
                      </Typography>
                      <Typography as="p" level="body4" color="secondary">
                        {nft?.collection?.name}
                      </Typography>
                    </div> */}
                  </div>
                </div>
              </>
            )}
          </div>

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
