"use client"

import { Alert, AlertDescription, AlertIcon } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { IconButton } from "@/components/ui/icon-button"
import { Skeleton } from "@/components/ui/skeleton"
import { Typography } from "@/components/ui/typography"
import { WalletsTable } from "@/components/wallets/wallets-table"
import { useFetchGroup } from "@/hooks/use-fetch-contact-groups"
import { formatNumber } from "@/utils/number"
import dayjs from "dayjs"
import { AlertCircleIcon, ChevronLeftIcon } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function GroupDetail() {
  const params = useParams<{ groupId: string }>()

  const { data, isLoading } = useFetchGroup(params.groupId)

  const group = data?.data

  if (isLoading)
    return (
      <div className="mx-auto w-full max-w-screen-xl space-y-12">
        <div className="space-y-2">
          <Skeleton className="w-1/3 h-6 rounded-md" />
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
        <div className="space-y-4">
          <Skeleton className="w-4/5 h-6 rounded-md" />
          <Skeleton className="w-3/5 h-6 rounded-md" />
          <Skeleton className="w-2/5 h-6 rounded-md" />
          <Skeleton className="w-1/5 h-6 rounded-md" />
        </div>
      </div>
    )

  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex justify-between">
        <div className="flex gap-2 items-start">
          <IconButton as={Link} size="sm" href="/dashboard/wallets">
            <ChevronLeftIcon />
          </IconButton>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
                {group?.name}
              </Typography>
              <Badge variant="info">{formatNumber(group?.numOfAudience ?? 0)} wallets</Badge>
            </div>
            <Typography level="body4" color="secondary">
              {dayjs(group?.createdAt).format("DD/MM/YYYY")}
            </Typography>
          </div>
        </div>
      </div>

      {group && (
        <>
          {group.numOfAudience === 0 && (
            <Alert variant="info">
              <AlertIcon>
                <AlertCircleIcon />
              </AlertIcon>
              <div>
                <AlertDescription>
                  This process is currently in progress. The duration of completion will depend on the number of wallets
                  involved. You are welcome to close the page and return later.
                </AlertDescription>
              </div>
            </Alert>
          )}
          <WalletsTable group={group} />
        </>
      )}
    </div>
  )
}
