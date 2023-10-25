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
          backgroundImage: "linear-gradient(to bottom, #dbf4ff, #fff1f1)",
          fontSize: 60,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: "center",
        }}
      >
        <div
          style={{
            backgroundImage: "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 216))",
            backgroundClip: "text",
            // @ts-ignore
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
        >
          cNFT
        </div>
        <div
          style={{
            backgroundImage: "linear-gradient(90deg, rgb(121, 40, 202), rgb(255, 0, 128))",
            backgroundClip: "text",
            // @ts-ignore
            "-webkit-background-clip": "text",
            color: "transparent",
          }}
        >
          Airdrop
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
