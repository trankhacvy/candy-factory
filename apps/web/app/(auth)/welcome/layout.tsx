import { Metadata } from "next"
import { ReactNode } from "react"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Welcome | ${siteConfig.description}`,
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
