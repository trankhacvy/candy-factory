"use client"

import Image from "next/image"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Typography } from "../ui/typography"

export default function NFTDetails() {
  return (
    <div className="w-full rounded-2xl p-6 shadow-card">
      <div className="flex justify-center">
        <Image
          alt="the explorer"
          width={240}
          height={240}
          src="https://ui8-crypter-2.herokuapp.com/img/content/cute-planet-large.jpg"
          className="rounded-2xl"
        />
      </div>
      <div className="mx-auto flex max-w-lg gap-4 px-6 py-10">
        <div className="flex-1 space-y-2">
          <Typography level="body4" className="font-medium uppercase">
            Collection
          </Typography>
          <div className="flex items-center gap-2">
            <Image
              alt="the explorer"
              width={40}
              height={40}
              src="https://ui8-crypter-2.herokuapp.com/img/content/cute-planet-large.jpg"
              className="rounded-xl"
            />
            <div className="space-y-1">
              <Typography className="font-bold">Cute planet</Typography>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <Typography level="body4" className="font-medium uppercase">
            Collection
          </Typography>
          <div className="flex items-center gap-2">
            <Image
              alt="the explorer"
              width={40}
              height={40}
              src="https://ui8-crypter-2.herokuapp.com/img/content/cute-planet-large.jpg"
              className="rounded-xl"
            />
            <div className="space-y-1">
              <Typography className="font-bold">Cute planet</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <Badge variant="success" className="shrink-0">
          Lumburr
        </Badge>
        <Typography as="h3" level="h4" className="font-bold">
          Foundations Matte Flip Flop
        </Typography>
        <Typography className="text-gray-600">
          Featuring the original ripple design inspired by Japanese bullet trains, the Nike Air Max 97 lets you push
          your style full-speed ahead.
        </Typography>
      </div>
      <Separator className="mt-6" />
    </div>
  )
}
