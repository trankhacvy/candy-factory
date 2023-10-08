"use client"

import { DropTransactions } from "@/components/drops/drop-transactions"
import { Badge } from "@/components/ui/badge"
import { IconButton } from "@/components/ui/icon-button"
import { Typography } from "@/components/ui/typography"
import { useFetchDrop } from "@/hooks/use-fetch-drops"
import dayjs from "dayjs"
import { ChevronLeftIcon, Loader2Icon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function DropDetail() {
  const params = useParams<{ dropId: string }>()
  const { data: session } = useSession()
  const { data, isLoading } = useFetchDrop(params.dropId)

  const drop = data?.data

  if (!session || isLoading || !drop) return <p>loading...</p>

  const isFinished = drop.mintedNft === drop.numOfNft

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex justify-between">
        <div className="flex gap-2 items-start">
          <IconButton as={Link} size="sm" href="/dashboard">
            <ChevronLeftIcon />
          </IconButton>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
                {drop?.name}
              </Typography>
              <Badge className="gap-2" variant={isFinished ? "success" : "info"}>
                {`${isFinished ? "Sent" : "Sending"} ${drop?.mintedNft}/${drop?.numOfNft}`}
                {!isFinished && <Loader2Icon className="w-4 h-4 animate-spin duration-500" />}
              </Badge>
            </div>
            <Typography level="body4" color="secondary">
              {dayjs(drop?.createdAt).format("DD/MM/YYYY")}
            </Typography>
          </div>
        </div>
      </div>

      <DropTransactions drop={drop} />
    </div>
  )
}
