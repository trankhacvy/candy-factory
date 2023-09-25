"use client"

import { MenuIcon } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/config/site"
import ConnectWalletButton from "../connect-wallet-button"
import { Button } from "../ui/button"
import { IconButton } from "../ui/icon-button"

function Header() {
  return (
    <div className="mx-auto max-w-screen-xl px-5">
      <header className="my-5 flex flex-col items-center justify-between lg:flex-row">
        <div className="flex w-full items-center justify-between lg:w-auto">
          <a href="/" className="flex items-center gap-2 text-lg font-bold">
            <Image src="/assets/logo.png" width={40} height={40} alt={siteConfig.name} />
            {siteConfig.name}
          </a>
          <div className="block lg:hidden">
            <IconButton aria-label="Toggle Menu">
              <MenuIcon />
            </IconButton>
          </div>
        </div>

        <div>
          <div className="hidden items-center gap-4 lg:flex">
            <ConnectWalletButton />
          </div>
        </div>
      </header>
    </div>
  )
}

function Footer() {
  return (
    <footer className="my-20">
      <p className="text-center text-sm text-slate-500">
        Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </p>
      <p className="mt-1 text-center text-xs text-slate-500">We build in public</p>
    </footer>
  )
}

export default function InboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
