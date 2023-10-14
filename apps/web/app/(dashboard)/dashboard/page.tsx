import { AlertTriangleIcon, Plus } from "lucide-react"
import { DropsTable } from "@/components/drops/drops-table"
import { NewDropModal } from "@/components/drops/new-drop-modal"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Stats } from "@/components/stats/stats"
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@/components/ui/alert"

export default function DropsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <Stats />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
            Drops
          </Typography>
          <NewDropModal trigger={<Button startDecorator={<Plus />}>New Drop</Button>} />
        </div>
      </div>

      <DropsTable />
    </div>
  )
}
