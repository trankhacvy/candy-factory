"use client"

import { useFetchStats } from "@/hooks/use-fetch-stats"
import { StatCard, StatCardSkeleton } from "./stat-card"
import { formatNumber } from "@/utils/number"
import { DropletIcon, ImageIcon, WalletIcon } from "lucide-react"

export const Stats = () => {
  const { isLoading, data } = useFetchStats()

  if (isLoading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <StatCard
        title={formatNumber(data?.data?.totalDrop ?? 0)}
        subtitle="Total drop"
        icon={<DropletIcon className="w-[120px] h-[120px] text-info-500" />}
      />
      <StatCard
        title={formatNumber(data?.data?.totalAirdropedNft ?? 0)}
        subtitle="Total Airdroped cNFTs"
        icon={<ImageIcon className="w-[120px] h-[120px] text-primary-500" />}
      />
      <StatCard
        title={formatNumber(data?.data?.totalWallets ?? 0)}
        subtitle="Total wallets"
        icon={<WalletIcon className="w-[120px] h-[120px] text-warning-500" />}
      />
    </div>
  )
}
