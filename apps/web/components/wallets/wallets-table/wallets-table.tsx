"use client"

import { DataTable } from "@/components/ui/data-table/data-table"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Table,
  VisibilityState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Audience, AudienceGroup } from "@/types/schema"
import { useMemo, useState } from "react"
import truncate from "@/utils/truncate"
import { getExplorerUrl } from "@/utils/explorer"
import { useSession } from "next-auth/react"
import { useFetchWallets } from "@/hooks/use-fetch-contact-groups"
import dayjs from "dayjs"
import { Input } from "@/components/ui/input"
import { PageOptionRequest } from "@/types"
import useDebounce from "@/hooks/use-debounce"
import { RowActions } from "./row-action"

const useDebouncedSearchValue = (columnFilters: ColumnFiltersState) => {
  const searchValue = useMemo(
    () => columnFilters.find((filter) => filter.id === "wallet")?.value ?? "",
    [columnFilters]
  )

  return useDebounce<string>(searchValue as string, 300)
}

export function WalletsTable({ group }: { group?: AudienceGroup }) {
  const { data: session } = useSession()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const searchText = useDebouncedSearchValue(columnFilters)

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const pageRequest = useMemo(
    () =>
      ({
        page: pageIndex + 1,
        take: pageSize,
        q: searchText,
      }) as PageOptionRequest,
    [pageIndex, pageSize, searchText]
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
        return group ? <RowActions row={row} groupId={group.id} /> : null
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

interface DataTableToolbarProps {
  table: Table<Audience>
}

export function DataTableToolbar({ table }: DataTableToolbarProps) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={(table.getColumn("wallet")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("wallet")?.setFilterValue(event.target.value)}
          className="max-w-lg"
        />
      </div>
    </div>
  )
}
