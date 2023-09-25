import { CampaignForm } from "@/components/campaign/campaign-form"
import { Typography } from "@/components/ui/typography"

export default function NewCampaign() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
            New Campaign
          </Typography>
        </div>
      </div>

      <CampaignForm />
    </div>
  )
}
