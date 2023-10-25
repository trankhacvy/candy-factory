"use client"

import { Row } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EyeIcon, MoreHorizontalIcon } from "lucide-react"
import { IconButton } from "@/components/ui/icon-button"
import { useState, useRef } from "react"
import { NFT } from "@/types/schema"
import { NFTDetailModal } from "../nft-detail-modal"

interface RowActionsProps {
  row: Row<NFT>
}

export function RowActions({ row }: RowActionsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasOpenDetailDialog, setHasOpenDetailDialog] = useState(false)

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
        hidden={hasOpenDetailDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus()
            focusRef.current = null
            event.preventDefault()
          }
        }}
      >
        <NFTDetailModal
          nftId={row.original.id}
          trigger={
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                focusRef.current = dropdownTriggerRef.current
              }}
              className="gap-2"
            >
              <EyeIcon className="h-4 w-4" />
              View
            </DropdownMenuItem>
          }
          isOpen={hasOpenDetailDialog}
          onOpenChange={(open) => {
            setHasOpenDetailDialog(open)
            if (!open) {
              setDropdownOpen(false)
            }
          }}
        />

        {/*   <EditWalletModal
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
          isOpen={hasOpenDetailDialog}
          onOpenChange={(open) => {
            setHasOpenDetailDialog(open)
            if (!open) {
              setDropdownOpen(false)
            }
          }}
        /> */}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
