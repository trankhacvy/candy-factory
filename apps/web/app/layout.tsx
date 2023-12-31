import "@/styles/globals.css"
import { Analytics } from "@vercel/analytics/react"
import { Poppins } from "next/font/google"
import { Metadata } from "next"
import { Toaster } from "@/components/ui/toast"
import { siteConfig } from "@/config/site"
import { Providers } from "./provider"
require("@solana/wallet-adapter-react-ui/styles.css")

// const image = "./og-image.jpg"

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  icons: {
    icon: "/icons/favicon-32x32.png",
    shortcut: "/icons/favicon-32x32.png",
    apple: "/icons/apple-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/icons/apple-icon-precomposed.png",
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [image],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    // images: [image],
    creator: "@trankhacvy",
  },
}

const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          {children}
          <Analytics />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
