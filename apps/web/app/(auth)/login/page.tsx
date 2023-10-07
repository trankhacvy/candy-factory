import Image from "next/image"
import { Suspense } from "react"
import { siteConfig } from "@/config/site"
import LoginButton from "./login-button"

export default function LoginPage() {
  return (
    <div className="p-6 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-2xl sm:shadow-card">
      <Image
        alt={siteConfig.name}
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/assets/logo.png"
      />
      <h1 className="font-cal mt-6 text-center text-3xl dark:text-white">{siteConfig.name}</h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">{siteConfig.description}</p>

      <div className="mt-4">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginButton />
        </Suspense>
      </div>
    </div>
  )
}
