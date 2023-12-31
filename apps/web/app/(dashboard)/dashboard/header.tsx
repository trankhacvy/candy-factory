"use client"

import { MenuIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconButton } from "@/components/ui/icon-button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/utils/cn"
import { DashboardNavMobile } from "./nav"
import { signOut, useSession } from "next-auth/react"
import { useWallet } from "@solana/wallet-adapter-react"
import api from "@/lib/api"
import truncate from "@/utils/truncate"

export default function DashboardHeader() {
  const [small, setSmall] = useState(false)

  useEffect(() => {
    function handler() {
      setSmall(window.pageYOffset > 60)
    }

    window.addEventListener("scroll", handler)

    return () => {
      window.removeEventListener("scroll", handler)
    }
  }, [])

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-[40] h-16 w-full transition-[height] duration-200 ease-in-out lg:h-24 lg:w-[calc(100%-281px)]",
        { "bg-white/80 lg:h-[60px]": small }
      )}
    >
      <div className="relative flex h-full min-h-[56px] items-center px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <DashboardNavMobile
          trigger={
            <IconButton className="mr-2 lg:hidden" size="sm">
              <MenuIcon />
            </IconButton>
          }
        />

        <div className="flex grow items-center justify-end gap-4">
          <AdminUserMenu />
        </div>
      </div>
    </header>
  )
}

function AdminUserMenu() {
  const { data: session } = useSession()
  const { disconnect } = useWallet()
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button>
          <Avatar className="bg-gray-500/24">
            <AvatarImage src={`https://avatar.vercel.sh/demo@xx.com`} alt={session?.user.wallet ?? ""} />
            <AvatarFallback className="bg-primary-500 text-xl text-white">{session?.user.wallet ?? ""}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-52 p-0">
        <div className="px-5 py-3">
          <Typography className="truncate font-semibold" as="h6" level="body4">
            {truncate(session?.user.wallet ?? "", 12, true)}
          </Typography>
        </div>
        <Separator />
        <div className="p-2">
          <li className="cursor-pointer list-none rounded-md px-2 py-1.5 hover:bg-gray-500/8">
            <a
              onClick={async (event) => {
                event.preventDefault()
                signOut({
                  callbackUrl: "/login",
                })
                api.withToken(session?.accessToken).logout()
                disconnect()
              }}
            >
              Logout
            </a>
          </li>
        </div>
      </PopoverContent>
    </Popover>
  )
}
