"use client"

import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { useState, useRef } from "react"
import { DeleteGroupConfirmModal } from "./delete-group-confirm-modal"
import { AudienceGroup } from "@/types/schema"

interface RowActionsProps {
  row: Row<AudienceGroup>
}

export function RowActions({ row }: RowActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasOpenDeleteDialog, setHasOpenDeleteDialog] = useState(false)

  const dropdownTriggerRef = useRef(null)
  const focusRef = useRef<HTMLButtonElement | null>(null)

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <IconButton ref={dropdownTriggerRef} size="sm">
            <MoreHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </IconButton>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white w-[160px]"
        hidden={hasOpenDeleteDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus()
            focusRef.current = null
            event.preventDefault()
          }
        }}
      >
        <DeleteGroupConfirmModal
          groupId={row.original.id}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                focusRef.current = dropdownTriggerRef.current
              }}
              className="gap-2 text-error-600"
            >
              <Trash2Icon className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          }
          isOpen={hasOpenDeleteDialog}
          onOpenChange={(open) => {
            setHasOpenDeleteDialog(open)
            if (!open) {
              setDropdownOpen(false)
            }
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
