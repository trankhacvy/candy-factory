"use client"

import { AlertCircleIcon, ArrowLeftIcon, FlameIcon, SendIcon } from "lucide-react"
import { Button } from "../ui/button"

export default function NFTActions() {
  return (
    <div className="mb-10 flex justify-between gap-4">
      <Button variant="link" startDecorator={<ArrowLeftIcon />}>
        Back
      </Button>
      <div className="flex gap-4">
        <Button startDecorator={<SendIcon />}>Send</Button>
        <Button startDecorator={<FlameIcon />}>Burn</Button>
        <Button startDecorator={<AlertCircleIcon />}>Report</Button>
      </div>
    </div>
  )
}
