"use client"

import { Typography } from "@/components/ui/typography"
import { siteConfig } from "@/config/site"
import { WelcomeHeader } from "@/components/landing/welcome-header"
import LoginButton from "./login-button"

const LoginPage = () => {
  return (
    <div className="bg-blur-image">
      <WelcomeHeader />
      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:px-0">
        <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-card">
          <div className="mb-10">
            <Typography as="h4" level="body1" className="font-bold">
              Sign in to {siteConfig.name}
            </Typography>
          </div>
          <LoginButton />
        </div>
      </div>
    </div>
  )
}

export default LoginPage
