"use client"

import { Row } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EyeIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { IconButton } from "../icon-button"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <IconButton size="sm">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </IconButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white w-[160px]">
        <DropdownMenuItem className="gap-2">
          <EyeIcon className="h-4 w-4" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <PencilIcon className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-error-600">
          <Trash2Icon className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
