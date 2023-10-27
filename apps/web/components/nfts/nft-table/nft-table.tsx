"use client"

import dayjs from "dayjs"
import { useFetchNFTs } from "@/hooks/use-fetch-nfts"
import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import Image from "@/components/ui/image"
import { NFT } from "@/types/schema"
import { DataTable } from "@/components/ui/data-table/data-table"
import { Typography } from "@/components/ui/typography"
import Link from "next/link"
import { RowActions } from "./row-actions"

export function NFTTable() {
  const { data, isLoading } = useFetchNFTs()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<NFT>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const nft = row.original
        return (
          <div className="flex items-center gap-4">
            <Image
              className="rounded-lg w-12 h-12 overflow-hidden"
              src={nft.image ?? ""}
              alt={nft.name ?? ""}
              width={48}
              height={48}
            />
            <Link className="hover:underline cursor-pointer" href="">
              <Typography level="body4" className="font-semibold">
                {nft.name}
              </Typography>
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "collection",
      header: "Collection",
      cell: ({ row }) => {
        const nft = row.getValue("collection") as NFT
        return (
          <div className="flex items-center gap-4">
            <Image
              className="rounded-lg w-12 h-12 overflow-hidden"
              src={nft.image ?? ""}
              alt={nft.name ?? ""}
              width={48}
              height={48}
            />
            <Link className="hover:underline cursor-pointer" href="">
              <Typography level="body4" className="font-semibold">
                {nft.name}
              </Typography>
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        return <>{dayjs(row.getValue("createdAt")).format("DD/MM/YYYY")}</>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <RowActions row={row} />
      },
    },
  ]

  const table = useReactTable({
    data: data?.data?.data ?? [],
    columns,
    state: {
      columnFilters,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <div className="overflow-hidden rounded-2xl shadow-card">
      <DataTable loading={isLoading} table={table} columns={columns.length} />
    </div>
  )
}
