"use client"

import dayjs from "dayjs"
import { useParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchCampaignTxs } from "@/hooks/use-fetch-campaign-txs"
import truncate from "@/utils/truncate"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

export function CampaignTransactions() {
  const params = useParams()

  const { data: transactions, isLoading } = useFetchCampaignTxs(params?.campaignId as string | undefined)

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
            <TableHead>Wallet</TableHead>
            <TableHead>NFT</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-32">Create at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions?.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>{truncate(tx.wallet ?? "", 24, false)}</TableCell>
              <TableCell>
                <a
                  href={`https://translator.shyft.to/address/${tx.nft_address}?cluster=devnet&compressed=true`}
                  target="_blank" rel="noreferrer"
                >
                  {truncate(tx.nft_address ?? "", 24, false)}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant="success">{tx.status}</Badge>
              </TableCell>
              <TableCell>
                <Typography color="secondary" level="body4">
                  {dayjs(tx.created_at).format("DD/MM/YYYY")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
