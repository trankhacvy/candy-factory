import { Plus } from "lucide-react"
import { CampaignsTable } from "@/components/campaign/campaigns-table"
import { NewCampaignModal } from "@/components/campaign/new-campaign-modal"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
            Campaigns
          </Typography>
          <NewCampaignModal trigger={<Button startDecorator={<Plus />}>New Campaign</Button>} />
        </div>
      </div>

      <CampaignsTable />
    </div>
  )
}
