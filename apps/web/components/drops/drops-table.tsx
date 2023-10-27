"use client"

import dayjs from "dayjs"
import { useFetchDrops } from "@/hooks/use-fetch-drops"
import { DataTable } from "../ui/data-table/data-table"
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Drop } from "@/types/schema"
import { DataTableRowActions } from "../ui/data-table/row-action"
import { useState } from "react"
import Link from "next/link"
import { Typography } from "../ui/typography"
import { useSession } from "next-auth/react"

export function DropsTable() {
  const { data: session } = useSession()
  const { data, isLoading } = useFetchDrops()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<Drop>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/dashboard/${row.original.id}`} className="hover:underline cursor-pointer">
            <Typography level="body4" className="font-semibold">
              {row.getValue("name")}
            </Typography>
          </Link>
        )
      },
    },
    {
      accessorKey: "numOfNft",
      header: "Num of NFT",
    },
    {
      accessorKey: "mintedNft",
      header: "Minted NFT",
    },
    {
      accessorKey: "createdAt",
      header: "Create at",
      cell: ({ row }) => {
        return <>{dayjs(row.getValue("createdAt")).format("DD/MM/YYYY")}</>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return <DataTableRowActions row={row} />
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
      <DataTable loading={isLoading || !session} table={table} columns={columns.length} />
    </div>
  )
}
