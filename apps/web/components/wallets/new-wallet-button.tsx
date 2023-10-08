"use client"

import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { NewAddressesGroupModal } from "./new-addresses-group-modal"

export function NewWalletButton() {
  const [hasOpenDialog, setHasOpenDialog] = useState(false)

  return (
    <NewAddressesGroupModal
      trigger={<Button startDecorator={<PlusIcon />}>New group</Button>}
      isOpen={hasOpenDialog}
      onOpenChange={setHasOpenDialog}
    />
  )
}
