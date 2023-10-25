"use client"

import { XIcon } from "lucide-react"
import qs from "query-string"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { IconButton } from "@/components/ui/icon-button"
import { useToast } from "@/components/ui/toast"
import { useSession } from "next-auth/react"
import { useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { mutate } from "swr"

type DeleteWalletConfirmModalProps = {
  trigger: React.ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  groupId: number
  walletId: number
}

export const DeleteWalletConfirmModal = ({
  trigger,
  isOpen,
  onOpenChange,
  groupId,
  walletId,
}: DeleteWalletConfirmModalProps) => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { data: session } = useSession()

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    try {
      setLoading(true)
      const response = await api.withToken(session?.accessToken).deleteWallet(walletId)

      if (response.statusCode === 204) {
        await Promise.all([
          mutate(`/audience-groups/${groupId}`),
          mutate(
            `/audience-groups/${groupId}/wallets?${qs.stringify({
              page: 1,
              take: 20,
              q: "",
            })}`
          ),
        ])

        toast({
          variant: "success",
          title: "The wallet has been successfully deleted.",
        })
        onOpenChange?.(false)
        setLoading(false)
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Unknown error",
        })
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        <AlertDialogContent className="max-h-[calc(100vh-80px)] max-w-lg overflow-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete</AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogDescription>Are you sure want to delete?</AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild color="error">
              <Button onClick={handleDelete} loading={loading} color="error">
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>

          <AlertDialogCancel asChild>
            <IconButton
              size="sm"
              color="default"
              className="absolute right-2 top-2 border-none text-gray-800 !shadow-none hover:bg-gray-800/8 focus:ring-0"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </IconButton>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
