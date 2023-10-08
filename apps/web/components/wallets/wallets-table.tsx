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
import { Audience, AudienceGroup } from "@/types/schema"
import { useMemo, useState } from "react"
import { DataTableToolbar } from "../ui/data-table/table-toolbar"
import truncate from "@/utils/truncate"
import { getExplorerUrl } from "@/utils/explorer"
import { useSession } from "next-auth/react"
import { useFetchWallets } from "@/hooks/use-fetch-contact-groups"
import dayjs from "dayjs"
import { DataTableRowActions } from "../ui/data-table/row-action"

export function WalletsTable({ group }: { group?: AudienceGroup }) {
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

  const { data: walletsData, isLoading: isTxLoading } = useFetchWallets(String(group?.id), pageRequest)

  const wallets = walletsData?.data?.data ?? []

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  )

  const columns: ColumnDef<Audience>[] = [
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
      accessorKey: "createdAt",
      header: "Created at",
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
    data: wallets,
    pageCount: walletsData?.data?.meta.pageCount ?? -1,
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
        toolbar={<DataTableToolbar table={table} />}
      />
    </div>
  )
}
