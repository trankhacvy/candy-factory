"use client"

import { Button } from "./ui/button"
import Image from "./ui/image"
import { Input } from "./ui/input"
import { Typography } from "./ui/typography"

export function SignUpForm() {
  return (
    <div className="flex gap-10 overflow-hidden rounded-2xl p-6 shadow-card">
      <div className="flex basis-3/5 flex-col items-center rounded-xl bg-gray-500/24 p-20">
        <Image className="rounded-full" src="/assets/logo.png" alt="logo" width={120} height={120} />
        <Typography as="h3" level="h5" color="primary" className="mt-6">
          Subscribe to our newsletter
        </Typography>
        <div className="mt-6 flex w-full items-center gap-4">
          <Input className="" fullWidth placeholder="Your wallet" />
          <Button>Subsribe</Button>
        </div>
      </div>

      <div className="basis-2/5 rounded-xl">
        <Typography className="font-bold">Embed code</Typography>
        <div className="mt-5 rounded-xl bg-gray-500/24 p-4">
          {`<script src="https://cdnjs.super.com/embed/signup.min.js"></script>`}
        </div>
        <Typography level="body4" color="secondary">
          Paste this code onto any website where you&apos;d like your signup form to appear
        </Typography>
        <div className="mt-4 flex justify-end">
          <Button>Copy code</Button>
        </div>
      </div>
    </div>
  )
}
