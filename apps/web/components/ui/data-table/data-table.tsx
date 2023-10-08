"use client"

import { Table as TSTable, flexRender } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "./pagination"
import { ReactNode } from "react"
import { Skeleton } from "../skeleton"

interface DataTableProps<TData> {
  loading?: boolean
  table: TSTable<TData>
  columns: number
  toolbar?: ReactNode
}

export function DataTable<TData>({ table, columns, loading, toolbar }: DataTableProps<TData>) {
  let content: React.ReactNode = null

  if (loading) {
    content = (
      <>
        {Array.from({ length: 5 }).map((_, idx) => (
          <TableRow key={`row-${idx}`}>
            {Array.from({ length: columns }).map((_, idx) => (
              <TableCell key={`cell-${idx}`}>
                <Skeleton className="w-full h-4 rounded-md" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    )
  } else {
    content = (
      <>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </>
    )
  }

  return (
    <>
      {toolbar}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>{content}</TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  )
}
