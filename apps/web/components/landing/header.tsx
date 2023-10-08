"use client"

import LoginButton from "@/app/(auth)/login/login-button"
import { Typography } from "@/components/ui/typography"
import { siteConfig } from "@/config/site"
import { useWallet } from "@solana/wallet-adapter-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { PropsWithChildren } from "react"
import { Button } from "../ui/button"
import Link from "next/link"

const Container = ({ children }: PropsWithChildren) => {
  return <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-6">{children}</div>
}

export const AppHeader = () => {
  const { status } = useSession()
  const { connected } = useWallet()

  return (
    <header>
      <nav className="z-10 w-full absolute">
        <Container>
          <div className="flex flex-wrap items-center justify-between py-2 gap-6 md:py-4 md:gap-0 relative">
            <input aria-hidden="true" type="checkbox" name="toggle_nav" id="toggle_nav" className="hidden peer" />
            <div className="relative z-20 w-full flex justify-between lg:w-max md:px-0">
              <a href="#home" aria-label="logo" className="flex space-x-2 items-center">
                <Image alt={siteConfig.name} width={40} height={40} src="/assets/logo.png" />
                <Typography level="h6" className="font-bold" as="span">
                  {siteConfig.name}
                </Typography>
              </a>
              <div className="relative flex items-center lg:hidden max-h-10">
                <label
                  role="button"
                  htmlFor="toggle_nav"
                  aria-label="humburger"
                  id="hamburger"
                  className="relative  p-6 -mr-6"
                >
                  <div
                    aria-hidden="true"
                    id="line"
                    className="m-auto h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"
                  />
                  <div
                    aria-hidden="true"
                    id="line2"
                    className="m-auto mt-2 h-0.5 w-5 rounded bg-sky-900 dark:bg-gray-300 transition duration-300"
                  />
                </label>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="fixed z-10 inset-0 h-screen w-screen bg-white/70 backdrop-blur-2xl origin-bottom scale-y-0 transition duration-500 peer-checked:origin-top peer-checked:scale-y-100 lg:hidden dark:bg-gray-900/70"
            />
            <div
              className="flex-col z-20 flex-wrap gap-6 p-8 rounded-3xl border border-gray-100 bg-white shadow-2xl shadow-gray-600/10 justify-end w-full invisible opacity-0 translate-y-1  absolute top-full left-0 transition-all duration-300 scale-95 origin-top 
                        lg:relative lg:scale-100 lg:peer-checked:translate-y-0 lg:translate-y-0 lg:flex lg:flex-row lg:items-center lg:gap-0 lg:p-0 lg:bg-transparent lg:w-7/12 lg:visible lg:opacity-100 lg:border-none
                        peer-checked:scale-100 peer-checked:opacity-100 peer-checked:visible lg:shadow-none 
                        dark:shadow-none dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="mt-12 flex gap-4 lg:mt-0">
                {connected && status === "authenticated" && (
                  <Button as={Link} href="/dashboard">
                    Dashboard
                  </Button>
                )}
                <LoginButton />
              </div>
            </div>
          </div>
        </Container>
      </nav>
    </header>
  )
}
