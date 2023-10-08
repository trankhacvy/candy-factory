"use client"

import { useEffect, useState } from "react"
import { cn } from "@/utils/cn"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import { Typography } from "../ui/typography"

export function WelcomeHeader() {
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
      className={cn("fixed right-0 top-0 z-10 h-16 w-full transition duration-200 ease-in-out lg:h-20", {
        "bg-white/80 lg:h-[60px]": small,
      })}
      style={{
        transitionProperty: "height,background-color",
      }}
    >
      <div className="relative mx-auto flex h-full min-h-[56px] w-full max-w-screen-xl items-center justify-between px-4 md:min-h-[64px] md:px-6 lg:px-10">
        <a href="/" aria-label="logo" className="flex space-x-2 items-center">
          <Image alt={siteConfig.name} width={40} height={40} src="/assets/logo.png" />
          <Typography level="h6" className="font-bold" as="span">
            {siteConfig.name}
          </Typography>
        </a>
      </div>
      {small && <div className="absolute inset-x-0 bottom-0 z-[-1] h-6 rounded-[50%] opacity-40 shadow-dropdown" />}
    </header>
  )
}
