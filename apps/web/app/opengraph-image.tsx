import { ImageResponse } from "next/server"

export const runtime = "edge"

export const alt = "About Acme"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          backgroundImage: "linear-gradient(to right, #ee9ca7, #ffdde1)",
          textAlign: "center",
        }}
      >
        <img
          src="https://candy-factory-m1yvqi6u4-khacvy93.vercel.app/_next/image?url=%2Fassets%2Flogo.png&w=96&q=75"
          width={160}
          height={160}
        />

        <div
          style={{
            backgroundImage: "linear-gradient(to right, #8a2387, #e94057, #f27121)",
            backgroundClip: "text",
            // @ts-ignore
            "-webkit-background-clip": "text",
            color: "transparent",
            fontSize: 60,
            letterSpacing: -2,
            fontWeight: 700,
            maxWidth: "700px",
          }}
        >
          The easiest way to airdrop cNFTs at scale
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
