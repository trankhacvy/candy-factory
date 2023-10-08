import dynamic from "next/dynamic"
import { cn } from "@/utils/cn"
import { ButtonProps } from "@solana/wallet-adapter-react-ui/lib/types/Button"

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
)

export default function ConnectWalletButton({ className, ...rest }: ButtonProps) {
  return (
    <WalletMultiButtonDynamic
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-colors",
        "focus:outline-none focus:ring-4",
        "disabled:pointer-events-none",
        "active:scale-95",
        "bg-gray-800 text-white",
        "hover:bg-gray-700",
        "focus:ring-gray-800/16"
      )}
      {...rest}
    />
  )
}
