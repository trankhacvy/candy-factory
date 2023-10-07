import { Plus } from "lucide-react"
import { DropTransactions } from "@/components/drops/drop-transactions"
// import { NewCampaignModal } from "@/components/drops/new-campaign-modal"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function CampaignDetails() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
            Campaign detail
          </Typography>
          {/* <NewCampaignModal trigger={<Button startDecorator={<Plus />}>New Campaign</Button>} /> */}
        </div>
      </div>

      <DropTransactions />
    </div>
  )
}
