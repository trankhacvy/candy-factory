"use client"

import { DropletIcon, ImageIcon, Settings, SettingsIcon, WalletIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSelectedLayoutSegments } from "next/navigation"
import React, { useMemo } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@/components/ui/sheet"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/utils/cn"
import { siteConfig } from "@/config/site"

export default function Nav() {
  const segments = useSelectedLayoutSegments()
  const { dropId } = useParams() as { dropId?: string }

  const tabs = useMemo(() => {
    return [
      {
        name: "Drops",
        href: "/dashboard",
        isActive: segments.length === 0 || (dropId && segments[0] === dropId),
        icon: <DropletIcon width={18} />,
      },
      {
        name: "Wallets",
        href: "/dashboard/wallets",
        isActive: segments[0] === "wallets",
        icon: <WalletIcon width={18} />,
      },
      {
        name: "NFTs",
        href: "/dashboard/nfts",
        isActive: segments[0] === "nfts",
        icon: <ImageIcon width={18} />,
      },
      {
        name: "Payments",
        href: "/dashboard/payments",
        isActive: segments[0] === "payments",
        icon: <SettingsIcon width={18} />,
      },
    ]
  }, [segments, dropId])

  return (
    <nav className="hidden w-[280px] shrink-0 lg:block">
      <div className="fixed left-0 top-0 z-0 h-full w-[280px] overflow-y-auto border-r border-dashed border-r-gray-500/24">
        <div className="mb-4 px-5 py-6">
          <Link href="/" className="rounded-lg">
            <Image
              src="/assets/logo.png"
              width={48}
              height={48}
              alt={siteConfig.name}
              className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
            />
          </Link>
        </div>
        <div className="flex flex-col">
          <ul className="relative px-4">
            {tabs.map((item) => (
              <NavItem
                key={item.name}
                text={item.name}
                href={item.href}
                selected={item.isActive as boolean}
                icon={item.icon}
              />
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export const DashboardNavMobile = ({ trigger }: { trigger: React.ReactNode }) => {
  const segments = useSelectedLayoutSegments()
  const { dropId } = useParams() as { dropId?: string }

  const tabs = useMemo(() => {
    return [
      {
        name: "Drops",
        href: "/dashboard",
        isActive: segments.length === 0 || (dropId && segments[0] === dropId),
        icon: <DropletIcon width={18} />,
      },
      {
        name: "Wallets",
        href: "/dashboard/wallets",
        isActive: segments[0] === "wallets",
        icon: <WalletIcon width={18} />,
      },
      {
        name: "NFTs",
        href: "/dashboard/nfts",
        isActive: segments[0] === "nfts",
        icon: <ImageIcon width={18} />,
      },
      {
        name: "Settings",
        href: "/dashboard/settings",
        isActive: segments[0] === "settings",
        icon: <SettingsIcon width={18} />,
      },
    ]
  }, [segments, dropId])

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent position="left" className="w-full max-w-sm">
        <SheetHeader>
          <Link href="/" className="rounded-lg">
            <Image
              src="/assets/logo.png"
              width={48}
              height={48}
              alt="Logo"
              className="dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
            />
          </Link>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-10">
          {tabs.map((item) => (
            <NavItem
              key={item.name}
              text={item.name}
              href={item.href}
              selected={item.isActive as boolean}
              icon={item.icon}
            />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

type NavItemProps = {
  text: string
  href: string
  selected?: boolean
  icon?: React.ReactNode
}

const NavItem = ({ text, href, selected, icon }: NavItemProps) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "mb-2 flex h-12 cursor-pointer select-none items-center justify-start gap-2 rounded-lg py-2 pl-3 pr-4",
          { "bg-primary-500/8": selected },
          { "hover:bg-gray-500/8": !selected }
        )}
      >
        <span
          className={cn("h-6 w-6 rounded-full", {
            "text-primary-500": selected,
            "text-gray-600": !selected,
          })}
        >
          {icon}
        </span>
        <Typography
          level="body4"
          className={cn("font-semibold", {
            "text-primary-500": selected,
            "text-gray-600": !selected,
          })}
        >
          {text}
        </Typography>
      </div>
    </Link>
  )
}
