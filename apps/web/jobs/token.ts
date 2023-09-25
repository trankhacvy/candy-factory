import { eventTrigger } from "@trigger.dev/sdk"
import { client } from "@/trigger"
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js"
import { SOLANA_PRC } from "@/config/env"
import { loadMasterWallet } from "@/utils/keypair"
import { Database } from "@/types/supabase.types"

client.defineJob({
  id: "airdropToken",
  name: "airdropToken",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "airdropToken",
  }),
  enabled: true,
  run: async (payload, io, ctx) => {
    const { audiences } = payload as { audiences: Database["public"]["Tables"]["audiences"]["Row"][] }

    const payer = loadMasterWallet()
    await io.logger.info("payer: ", { payer: payer.publicKey.toBase58() })

    const connection = new Connection("https://rpc.shyft.to/79p-uM6W1uAWlvah", { commitment: "confirmed" })

    const tasks = audiences.map((audience) => {
      return io.runTask(
        `airdrop-${audience.id}`,
        async () => {
          try {
            const transferTransaction = new Transaction().add(
              SystemProgram.transfer({
                fromPubkey: payer.publicKey,
                toPubkey: new PublicKey(audience.wallet ?? ""),
                lamports: LAMPORTS_PER_SOL / 10000,
              })
            )
            const result = await sendAndConfirmTransaction(connection, transferTransaction, [payer])

            await io.logger.info(`airdrop to ${audience.wallet} success. Tx: ${result}`)
            return result
          } catch (error) {
            throw error
          }
        },
        { name: `airdrop-${audience.id}` }
      )
    })

    const response = await Promise.all(tasks)

    // const metaplex = Metaplex.make(connection).use(keypairIdentity(payer))

    // const nft = campaign.nfts

    // const collectionNFTMetadata: CreateNftInput = {
    //   name: nft?.name ?? "",
    //   symbol: nft?.symbol ?? "",
    //   uri: nft?.metadata_uri ?? "",
    //   sellerFeeBasisPoints: 0,
    //   creators: [
    //     {
    //       address: payer.publicKey,
    //       authority: payer,
    //       share: 100,
    //     },
    //   ],
    //   isCollection: true,
    // }

    // const {
    //   mintAddress: collectionAddress,
    //   metadataAddress,
    //   masterEditionAddress,
    // } = await metaplex.nfts().create(collectionNFTMetadata)

    // await io.logger.info("collectionAddress: ", { collectionAddress: collectionAddress.toBase58() })

    // contacts.forEach(async (contact: any) => {
    //   const compressedNFTMetadata: MetadataArgs = {
    //     name: nft?.name ?? "",
    //     symbol: nft?.symbol ?? "",
    //     uri: nft?.metadata_uri ?? "",
    //     sellerFeeBasisPoints: 0,
    //     creators: [
    //       {
    //         address: payer.publicKey,
    //         verified: true,
    //         share: 100,
    //       },
    //     ],
    //     editionNonce: 0,
    //     uses: null,
    //     collection: null,
    //     primarySaleHappened: false,
    //     isMutable: true,
    //     tokenProgramVersion: TokenProgramVersion.Original,
    //     tokenStandard: TokenStandard.NonFungible,
    //   }

    //   const ix = await mintCompressedTXNFT(
    //     payer,
    //     new PublicKey(MASTER_TREE),
    //     collectionAddress,
    //     metadataAddress,
    //     masterEditionAddress,
    //     compressedNFTMetadata,
    //     new PublicKey(contact.wallet ?? "")
    //   )

    //   const txSignature = await sendAndConfirmTransaction(connection, new Transaction().add(...ix), [payer], {
    //     commitment: "confirmed",
    //     skipPreflight: true,
    //   })

    //   await io.logger.info("txSignature: ", { txSignature })

    //   const assets = await helius.rpc.getAssetsByGroup({
    //     groupKey: "collection",
    //     groupValue: collectionAddress.toBase58(),
    //     sortBy: {
    //       sortBy: AssetSortBy.Created,
    //       sortDirection: AssetSortDirection.Asc,
    //     },
    //     page: 1,
    //   })

    //   const asset = assets.items.find((asset) => asset.ownership.owner === contact.wallet)

    //   await supabase.from("tbl_campaign_transactions").insert({
    //     wallet: contact.wallet,
    //     campaign_id: campaignId,
    //     nft_address: asset?.id,
    //     signature: txSignature,
    //     status: "success",
    //   })
    // })

    await io.logger.info("✨ Congratulations, You just ran your first successful Trigger.dev Job! ✨")

    return response
  },
})
