"use client"

import { DataTable } from "../ui/data-table/data-table"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Drop, DropTransaction } from "@/types/schema"
import { useMemo, useState } from "react"
import { useFetchDropTxs } from "@/hooks/use-fetch-drop-txs"
import truncate from "@/utils/truncate"
import { getExplorerUrl } from "@/utils/explorer"
import { Badge } from "../ui/badge"
import { useSession } from "next-auth/react"

export function DropTransactions({ drop }: { drop?: Drop }) {
  const { data: session } = useSession()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const pageRequest = useMemo(
    () => ({
      page: pageIndex + 1,
      take: pageSize,
    }),
    [pageIndex, pageSize]
  )

  const { data: transactionsData, isLoading: isTxLoading } = useFetchDropTxs(
    String(drop?.id),
    pageRequest,
    drop && drop.mintedNft < drop.numOfNft
  )

  const transactions = transactionsData?.data?.data ?? []

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const columns: ColumnDef<DropTransaction>[] = [
    {
      accessorKey: "wallet",
      header: "Wallet",
      cell: ({ row }) => {
        return (
          <a target="_blank" href={getExplorerUrl(row.getValue("wallet"), "address")}>
            {truncate(row.getValue("wallet") ?? "", 12, true)}
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
            {truncate(row.getValue("signature") ?? "", 20, true)}
          </a>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status")
        return <Badge variant={status === 1 ? "info" : "success"}>{status == 1 ? "Processing" : "Success"}</Badge>
      },
    },
  ]

  const table = useReactTable({
    data: transactions,
    pageCount: transactionsData?.data?.meta.pageCount ?? -1,
    columns,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
  })

  return (
    <div className="overflow-hidden rounded-2xl shadow-card">
      <DataTable
        loading={isTxLoading || !session}
        table={table}
        columns={columns.length}
        // toolbar={<DataTableToolbar table={table} />}
      />
    </div>
  )
}
