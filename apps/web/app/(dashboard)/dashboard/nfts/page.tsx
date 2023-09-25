import { PlusIcon } from "lucide-react"
import Link from "next/link"
import { NFTTable } from "@/components/nfts/nft-table"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"

export default function NFTsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl space-y-12">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Typography as="h4" level="body1" className="font-bold lg:text-2xl">
            NFTs
          </Typography>
          <Link href="/dashboard/nfts/new">
            <Button startDecorator={<PlusIcon />}>New NFT</Button>
          </Link>
        </div>
      </div>

      <NFTTable />
    </div>
  )
}
