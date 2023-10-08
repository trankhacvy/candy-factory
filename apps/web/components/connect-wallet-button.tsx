import dynamic from "next/dynamic"
import { cn } from "@/utils/cn"
import { buttonVariants } from "./ui/button"
import { ButtonProps } from "@solana/wallet-adapter-react-ui/lib/types/Button"

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

export default function ConnectWalletButton({ className, ...rest }: ButtonProps) {
  return (
    <WalletMultiButtonDynamic
      className={cn(
        buttonVariants({
          fullWidth: true,
          className,
        })
      )}
      {...rest}
    />
  )
}
