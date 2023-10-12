import { TransactionsTable } from "@/components/settings/transaction-table"
import { Typography } from "@/components/ui/typography"

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
            Settings
          </Typography>
        </div>
      </div>
      <TransactionsTable />
    </div>
  )
}
