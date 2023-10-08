"use client"

import { Badge } from "@/components/ui/badge"
import { IconButton } from "@/components/ui/icon-button"
import { Typography } from "@/components/ui/typography"
import { WalletsTable } from "@/components/wallets/wallets-table"
import { useFetchGroup } from "@/hooks/use-fetch-contact-groups"
import dayjs from "dayjs"
import { ChevronLeftIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function GroupDetail() {
  const params = useParams<{ groupId: string }>()
  const { data: session } = useSession()

  const { data, isLoading } = useFetchGroup(params.groupId)

  const isFirstLoading = !session || isLoading

  const group = data?.data

  if (isFirstLoading) return <p>loading...</p>

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
              <Badge variant="info">{group?.numOfAudience}</Badge>
            </div>
            <Typography level="body4" color="secondary">
              {dayjs(group?.createdAt).format("DD/MM/YYYY")}
            </Typography>
          </div>
        </div>
      </div>

      {group && <WalletsTable group={group} />}
    </div>
  )
}
