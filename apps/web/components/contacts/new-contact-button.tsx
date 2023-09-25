"use client"

import { PlusIcon, User2Icon, UserIcon } from "lucide-react"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NewContactModal } from "./new-contact-modal"

export function NewContactButton() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [hasOpenDialog, setHasOpenDialog] = useState(false)

  const dropdownTriggerRef = useRef(null)
  const focusRef = useRef(null)

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button ref={dropdownTriggerRef} startDecorator={<PlusIcon />}>
          New Contact
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            // @ts-ignore
            focusRef.current.focus()
            focusRef.current = null
            event.preventDefault()
          }
        }}
        className="w-48 bg-white"
      >
        <NewContactModal
          trigger={
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault()
                focusRef.current = dropdownTriggerRef.current
              }}
              className="flex items-center gap-2"
            >
              <UserIcon />
              Add a single contact
            </DropdownMenuItem>
          }
          isOpen={hasOpenDialog}
          onOpenChange={(open) => {
            setHasOpenDialog(open)
            if (open === false) {
              setDropdownOpen(false)
            }
          }}
        />
        <DropdownMenuItem className="flex items-center gap-2">
          <User2Icon />
          Import a CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
