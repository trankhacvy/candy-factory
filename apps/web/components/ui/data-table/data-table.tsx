"use client"

import { Table as TSTable, flexRender } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DataTablePagination } from "./pagination"
import { ReactNode } from "react"
import { Typography } from "../typography"

interface DataTableProps<TData> {
  loading?: boolean
  table: TSTable<TData>
  columns: number
  toolbar?: ReactNode
}

export function DataTable<TData>({ loading, table, columns, toolbar }: DataTableProps<TData>) {
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

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell className="text-center" colSpan={columns}>
                <Typography color="secondary">Loading...</Typography>
              </TableCell>
            </TableRow>
          ) : (
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
              )}{" "}
            </>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </>
  )
}
