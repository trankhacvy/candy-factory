"use client"

import dayjs from "dayjs"
import { useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Transaction } from "@/types/schema"
import { DataTable } from "../ui/data-table/data-table"
import { useFetchTransactions } from "@/hooks/use-fetch-transactions"
import { getExplorerUrl } from "@/utils/explorer"
import truncate from "@/utils/truncate"

export function TransactionsTable() {
  const { data, isLoading } = useFetchTransactions()

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "sender",
      header: "Payer",
      cell: ({ row }) => {
        return (
          <a target="_blank" href={getExplorerUrl(row.getValue("sender"), "address")}>
            {truncate(row.getValue("sender") ?? "", 12, true)}
          </a>
        )
      },
    },
    {
      accessorKey: "signature",
      header: "Signature",
      cell: ({ row }) => {
        return (
          <a target="_blank" href={getExplorerUrl(row.getValue("signature"), "signature")}>
            {truncate(row.getValue("signature") ?? "", 24, true)}
          </a>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "createdAt",
      header: "Created at",
      cell: ({ row }) => {
        return <>{dayjs(row.getValue("createdAt")).format("DD/MM/YYYY HH:MM")}</>
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
      <DataTable
        loading={isLoading}
        table={table}
        columns={columns.length}
        // toolbar={<DataTableToolbar table={table} />}
      />
    </div>
  )
}
