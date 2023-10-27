"use client"

import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon, Trash2Icon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { useState, useRef } from "react"
import { DeleteWalletConfirmModal } from "./delete-wallet-confirm-modal"
import { Audience } from "@/types/schema"
 
interface RowActionsProps {
  row: Row<Audience>
  groupId: number
}

export function RowActions({ row, groupId }: RowActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasOpenDeleteDialog, setHasOpenDeleteDialog] = useState(false)
  const [hasOpenEditDialog, setHasOpenEditDialog] = useState(false)

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
        hidden={hasOpenDeleteDialog || hasOpenEditDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus()
            focusRef.current = null
            event.preventDefault()
          }
        }}
      >
        {/* <DropdownMenuItem className="gap-2">
          <EyeIcon className="h-4 w-4" />
          View
        </DropdownMenuItem>

        <EditWalletModal
          groupId={groupId}
          walletId={row.original.id}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                focusRef.current = dropdownTriggerRef.current
              }}
              className="gap-2"
            >
              <PencilIcon className="h-4 w-4" />
              Edit
            </DropdownMenuItem>
          }
          isOpen={hasOpenEditDialog}
          onOpenChange={(open) => {
            setHasOpenEditDialog(open)
            if (!open) {
              setDropdownOpen(false)
            }
          }}
        /> */}

        <DeleteWalletConfirmModal
          groupId={groupId}
          walletId={row.original.id}
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
