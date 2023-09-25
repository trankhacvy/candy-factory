import { Metadata } from "next"
import { ReactNode } from "react"
import { siteConfig } from "@/config/site"

export const metadata: Metadata = {
  title: `Login | ${siteConfig.description}`,
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">{children}</div>
}
