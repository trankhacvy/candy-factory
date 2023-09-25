import Image from "next/image"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site"

export default function LoginPage() {
  return (
    <div className="mx-5 border border-stone-200 py-10 dark:border-stone-700 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md">
      <Image
        alt={siteConfig.name}
        width={100}
        height={100}
        className="relative mx-auto h-12 w-auto dark:scale-110 dark:rounded-full dark:border dark:border-stone-400"
        src="/assets/logo.png"
      />
      <h1 className="font-cal mt-6 text-center text-3xl dark:text-white">{siteConfig.name}</h1>
      <p className="mt-2 text-center text-sm text-stone-600 dark:text-stone-400">{siteConfig.description}</p>

      <div className="mx-auto mt-4 w-11/12 max-w-xs sm:w-full">
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          {/* <LoginButton /> */}
          <Button fullWidth>Login</Button>
        </Suspense>
      </div>
    </div>
  )
}
