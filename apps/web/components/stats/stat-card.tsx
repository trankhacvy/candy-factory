"use client"

import { Typography } from "@/components/ui/typography"
import { Skeleton } from "../ui/skeleton"

type StatCardProps = {
  title: string
  subtitle: string
  icon: React.ReactNode
}

export const StatCard = ({ title, subtitle, icon }: StatCardProps) => {
  return (
    <div className="shadow-card rounded-2xl bg-white p-4 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Typography className="font-semibold" level="h5" as="h3">
          {title}
        </Typography>
        <Typography level="body4" color="secondary">
          {subtitle}
        </Typography>
      </div>
      {icon}
    </div>
  )
}

export const StatCardSkeleton = () => {
  return (
    <div className="shadow-card rounded-2xl bg-white p-4 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton className="w-24 h-5 rounded-lg" />
        <Skeleton className="w-20 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-[120px] h-[120px]" />
    </div>
  )
}
