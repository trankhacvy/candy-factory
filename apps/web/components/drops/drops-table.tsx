"use client"

import dayjs from "dayjs"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useFetchDrops } from "@/hooks/use-fetch-drops"
import { Skeleton } from "../ui/skeleton"
import { Typography } from "../ui/typography"

export function DropsTable() {
  const { data, isLoading } = useFetchDrops()

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
          {data?.data?.data.map((drop) => (
            <TableRow key={drop.id}>
              <TableCell>
                <Link className="font-bold text-indigo-500 hover:underline" href={`/dashboard/${drop.id}`}>
                  {drop.name}
                </Link>
              </TableCell>
              <TableCell>
                <Typography color="secondary" level="body4">
                  {dayjs(drop.createdAt).format("DD/MM/YYYY")}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
