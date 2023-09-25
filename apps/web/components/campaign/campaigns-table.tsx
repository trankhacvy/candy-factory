"use client"

import dayjs from "dayjs"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchCampaigns } from "@/hooks/use-fetch-campaigns"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

export function CampaignsTable() {
  const { data, isLoading } = useFetchCampaigns()

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
            <TableHead>Campaigns</TableHead>
            <TableHead className="w-32">Create at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>
                <Link className="font-bold text-indigo-500 hover:underline" href={`/dashboard/${campaign.id}`}>
                  {campaign.name}
                </Link>
              </TableCell>
              <TableCell>
                <Typography color="secondary" level="body4">
                  {dayjs(campaign.created_at).format("DD/MM/YYYY")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
