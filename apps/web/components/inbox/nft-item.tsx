import dayjs from "dayjs"
import { DAS } from "helius-sdk"
import Link from "next/link"
import { cn } from "@/utils/cn"
import { placeholderBlurhash } from "@/utils/image"
import Image from "../ui/image"
import { Typography } from "../ui/typography"

type NFTItemProps = {
  read?: boolean
  asset: DAS.GetAssetResponse
}

export default function NFTItem({ read, asset }: NFTItemProps) {
  const image = asset.content?.files?.find((file) => file.mime?.toLocaleLowerCase().startsWith("image/"))

  return (
    <Link href={`/inbox/${asset.id}`}>
      <div className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-500/8">
        <Image
          src={image?.uri ?? ""}
          width={48}
          height={48}
          alt="nft"
          className="overflow-hidden rounded-full object-cover"
          blurDataURL={placeholderBlurhash}
        />
        <div className="flex-1">
          <Typography as="h6" className="font-semibold">
            {asset.content?.metadata.name}
          </Typography>
          <Typography
            level="body4"
            color={read ? "secondary" : undefined}
            className={cn("line-clamp-1", {
              "font-semibold": !read,
            })}
          >
            {asset.content?.metadata.description}
          </Typography>
        </div>
        <div className="flex flex-col items-end gap-3">
          {!read && <span className="h-2 w-2 rounded-full bg-primary-500" />}
        </div>
      </div>
    </Link>
  )
}
