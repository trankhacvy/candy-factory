"use server"
import { NFTStorage } from "nft.storage"
import * as z from "zod"
import { nftFormSchema } from "@/components/nfts/nft-form"
import { IPFS_GATEWAY } from "@/config/contants"
import { NFT_STORAGE_API_KEY } from "@/config/env"
import supabase from "@/lib/supabase"
import { ServerActionResponse } from "@/types"

export const createNFT = async (values: z.infer<typeof nftFormSchema>): Promise<ServerActionResponse<boolean>> => {
  try {
    const client = new NFTStorage({ token: NFT_STORAGE_API_KEY })
    const collectionImageBlob = await (await fetch(values.collectionMedia)).blob()
    const nftImageBlob = await (await fetch(values.media)).blob()

    const [collectionImageCid, nftImageCid] = await Promise.all([
      client.storeBlob(collectionImageBlob),
      client.storeBlob(nftImageBlob),
    ])

    console.log("Image CID", `${IPFS_GATEWAY}${collectionImageCid}`, `${IPFS_GATEWAY}${nftImageCid}`)

    const collectionMetadata = {
      name: values.collectionName ?? "",
      symbol: values.collectionSymbol ?? "",
      description: values.collectionDescription ?? "",
      seller_fee_basis_points: 0,
      external_url: values.collectionExternalUrl ?? "",
      image: `${IPFS_GATEWAY}${collectionImageCid}`,
      attributes: [],
      properties: {
        files: [
          {
            uri: `${IPFS_GATEWAY}${collectionImageCid}`,
            type: "image/png",
          },
        ],
        category: "image",
      },
    }

    const nftMetadata = {
      name: values.name ?? "",
      symbol: values.symbol ?? "",
      description: values.description ?? "",
      seller_fee_basis_points: 0,
      external_url: values.externalUrl ?? "",
      image: `${IPFS_GATEWAY}${nftImageCid}`,
      attributes: values.attributes ?? [],
      properties: {
        files: [
          {
            uri: `${IPFS_GATEWAY}${nftImageCid}`,
            type: "image/png",
          },
        ],
        category: "image",
      },
    }

    const [collectionMetadataCid, nftMetadataCid] = await Promise.all([
      client.storeBlob(new Blob([Buffer.from(JSON.stringify(collectionMetadata))])),
      client.storeBlob(new Blob([Buffer.from(JSON.stringify(nftMetadata))])),
    ])
    console.log("Metadata CID", `${IPFS_GATEWAY}${collectionMetadataCid}`, `${IPFS_GATEWAY}${nftMetadataCid}`)

    const { error } = await supabase.from("nfts").insert({
      // collection
      collection_name: values.name ?? "",
      collection_symbol: values.collectionSymbol ?? "",
      collection_description: values.collectionDescription ?? "",
      collection_image: `${IPFS_GATEWAY}${collectionImageCid}`,
      collection_metadata_uri: `${IPFS_GATEWAY}${collectionMetadataCid}`,
      //nft
      name: values.name ?? "",
      symbol: values.symbol ?? "",
      description: values.description ?? "",
      attributes: values.attributes ?? [],
      properties: {
        files: [
          {
            uri: `${IPFS_GATEWAY}${nftImageCid}`,
            type: "image/png",
          },
        ],
        category: "image",
      },
      image: `${IPFS_GATEWAY}${nftImageCid}`,
      metadata_uri: `${IPFS_GATEWAY}${nftMetadataCid}`,
    })

    if (error) throw error

    return {
      success: true,
      data: true,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Server error",
    }
  }
}
