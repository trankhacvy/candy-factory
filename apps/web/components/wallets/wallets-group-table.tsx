"use client"

import dayjs from "dayjs"
import { useFetchContactGroups } from "@/hooks/use-fetch-contact-groups"
import { useMemo, useState } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Table,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AudienceGroup } from "@/types/schema"
import { DataTable } from "../ui/data-table/data-table"
import { Input } from "../ui/input"
import Link from "next/link"
import { Typography } from "../ui/typography"
import { DataTableRowActions } from "../ui/data-table/row-action"
import { PageOptionRequest } from "@/types"
import useDebounce from "@/hooks/use-debounce"
import { formatNumber } from "@/utils/number"

const useDebouncedSearchValue = (columnFilters: ColumnFiltersState) => {
  const searchValue = useMemo(() => columnFilters.find((filter) => filter.id === "name")?.value ?? "", [columnFilters])

  return useDebounce<string>(searchValue as string, 300)
}

export function WalletsGroupTable() {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  })

  const searchText = useDebouncedSearchValue(columnFilters)

  const pageRequest = useMemo(
    () =>
      ({
        page: pageIndex + 1,
        take: pageSize,
        q: searchText,
      }) as PageOptionRequest,
    [pageIndex, pageSize, searchText]
  )

  const { data, isLoading } = useFetchContactGroups(pageRequest)

  const columns: ColumnDef<AudienceGroup>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <Link href={`/dashboard/wallets/${row.original.id}`} className="hover:underline cursor-pointer">
            <Typography level="body4" className="font-semibold">
              {row.getValue("name")}
            </Typography>
          </Link>
        )
      },
    },
    {
      accessorKey: "numOfAudience",
      header: "Num of wallets",
      cell: ({ row }) => {
        return <>{formatNumber(row.getValue("numOfAudience"))}</>
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
        toolbar={<DataTableToolbar table={table} />}
      />
    </div>
  )
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between p-5">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search group..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-xs"
        />
      </div>
    </div>
  )
}
