"use client"

import dayjs from "dayjs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchNFTs } from "@/hooks/use-fetch-nfts"
import Image from "../ui/image"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

export function NFTTable() {
  const { data, isLoading } = useFetchNFTs()

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
    <div className="overflow-hidden rounded-2xl shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NFT</TableHead>
            <TableHead>Collection</TableHead>
            <TableHead className="w-32">Create at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((nft) => (
            <TableRow key={nft.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <Image className="rounded-lg" src={nft.image ?? ""} alt={nft.name ?? ""} width={48} height={48} />
                  <Typography className="font-medium">{nft.name}</Typography>
                </div>
              </TableCell>
              <TableCell>{nft.collection_name}</TableCell>
              <TableCell>
                <Typography color="secondary" level="body4">
                  {dayjs(nft.created_at).format("DD/MM/YYYY")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
