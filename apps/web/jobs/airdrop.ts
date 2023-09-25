import { eventTrigger } from "@trigger.dev/sdk"
import { client } from "@/trigger"
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"
import { MASTER_TREE, SOLANA_PRC } from "@/config/env"
import supabase from "@/lib/supabase"
import { loadMasterWallet } from "@/utils/keypair"
import { CreateNftInput, Metaplex, keypairIdentity } from "@metaplex-foundation/js"
import { MetadataArgs, TokenProgramVersion, TokenStandard } from "@metaplex-foundation/mpl-bubblegum"
import { mintCompressedTXNFT } from "@/lib/compression"
import helius from "@/lib/helius"
import { AssetSortBy, AssetSortDirection } from "helius-sdk"

export function createJob(id: string) {
  return client.defineJob({
    id,
    name: id,
    version: "0.0.1",
    trigger: eventTrigger({
      name: id,
    }),
    enabled: true,
    run: async (payload, io, ctx) => {
      const { campaignId, campaign, contacts } = payload

      const payer = loadMasterWallet()
      await io.logger.debug("payer: ", { payer: payer.publicKey.toBase58() })
      const connection = new Connection(SOLANA_PRC, { commitment: "confirmed" })
      const metaplex = Metaplex.make(connection).use(keypairIdentity(payer))

      const nft = campaign.nfts

      const collectionNFTMetadata: CreateNftInput = {
        name: nft?.name ?? "",
        symbol: nft?.symbol ?? "",
        uri: nft?.metadata_uri ?? "",
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: payer.publicKey,
            authority: payer,
            share: 100,
          },
        ],
        isCollection: true,
      }

      const {
        mintAddress: collectionAddress,
        metadataAddress,
        masterEditionAddress,
      } = await metaplex.nfts().create(collectionNFTMetadata)

      await io.logger.debug("collectionAddress: ", { collectionAddress: collectionAddress.toBase58() })

      contacts.forEach(async (contact: any) => {
        const compressedNFTMetadata: MetadataArgs = {
          name: nft?.name ?? "",
          symbol: nft?.symbol ?? "",
          uri: nft?.metadata_uri ?? "",
          sellerFeeBasisPoints: 0,
          creators: [
            {
              address: payer.publicKey,
              verified: true,
              share: 100,
            },
          ],
          editionNonce: 0,
          uses: null,
          collection: null,
          primarySaleHappened: false,
          isMutable: true,
          tokenProgramVersion: TokenProgramVersion.Original,
          tokenStandard: TokenStandard.NonFungible,
        }

        const ix = await mintCompressedTXNFT(
          payer,
          new PublicKey(MASTER_TREE),
          collectionAddress,
          metadataAddress,
          masterEditionAddress,
          compressedNFTMetadata,
          new PublicKey(contact.wallet ?? "")
        )

        const txSignature = await sendAndConfirmTransaction(connection, new Transaction().add(...ix), [payer], {
          commitment: "confirmed",
          skipPreflight: true,
        })

        await io.logger.debug("txSignature: ", { txSignature })

        const assets = await helius.rpc.getAssetsByGroup({
          groupKey: "collection",
          groupValue: collectionAddress.toBase58(),
          sortBy: {
            sortBy: AssetSortBy.Created,
            sortDirection: AssetSortDirection.Asc,
          },
          page: 1,
        })

        const asset = assets.items.find((asset) => asset.ownership.owner === contact.wallet)

        await supabase.from("tbl_campaign_transactions").insert({
          campaign_id: campaignId,
          nft_address: asset?.id,
          signature: txSignature,
          status: "success",
        })
      })

      await io.logger.info("✨ Congratulations, You just ran your first successful Trigger.dev Job! ✨")
    },
  })
}

client.defineJob({
  id: "airdrop",
  name: "airdrop",
  version: "0.0.1",
  trigger: eventTrigger({
    name: "airdrop",
  }),
  enabled: true,
  run: async (payload, io, ctx) => {
    const { campaignId, campaign, contacts } = payload

    const payer = loadMasterWallet()
    await io.logger.info("payer: ", { payer: payer.publicKey.toBase58() })
    const connection = new Connection(SOLANA_PRC, { commitment: "confirmed" })
    const metaplex = Metaplex.make(connection).use(keypairIdentity(payer))

    const nft = campaign.nfts

    const collectionNFTMetadata: CreateNftInput = {
      name: nft?.name ?? "",
      symbol: nft?.symbol ?? "",
      uri: nft?.metadata_uri ?? "",
      sellerFeeBasisPoints: 0,
      creators: [
        {
          address: payer.publicKey,
          authority: payer,
          share: 100,
        },
      ],
      isCollection: true,
    }

    const {
      mintAddress: collectionAddress,
      metadataAddress,
      masterEditionAddress,
    } = await metaplex.nfts().create(collectionNFTMetadata)

    await io.logger.info("collectionAddress: ", { collectionAddress: collectionAddress.toBase58() })

    contacts.forEach(async (contact: any) => {
      const compressedNFTMetadata: MetadataArgs = {
        name: nft?.name ?? "",
        symbol: nft?.symbol ?? "",
        uri: nft?.metadata_uri ?? "",
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: payer.publicKey,
            verified: true,
            share: 100,
          },
        ],
        editionNonce: 0,
        uses: null,
        collection: null,
        primarySaleHappened: false,
        isMutable: true,
        tokenProgramVersion: TokenProgramVersion.Original,
        tokenStandard: TokenStandard.NonFungible,
      }

      const ix = await mintCompressedTXNFT(
        payer,
        new PublicKey(MASTER_TREE),
        collectionAddress,
        metadataAddress,
        masterEditionAddress,
        compressedNFTMetadata,
        new PublicKey(contact.wallet ?? "")
      )

      const txSignature = await sendAndConfirmTransaction(connection, new Transaction().add(...ix), [payer], {
        commitment: "confirmed",
        skipPreflight: true,
      })

      await io.logger.info("txSignature: ", { txSignature })

      const assets = await helius.rpc.getAssetsByGroup({
        groupKey: "collection",
        groupValue: collectionAddress.toBase58(),
        sortBy: {
          sortBy: AssetSortBy.Created,
          sortDirection: AssetSortDirection.Asc,
        },
        page: 1,
      })

      const asset = assets.items.find((asset) => asset.ownership.owner === contact.wallet)

      await supabase.from("tbl_campaign_transactions").insert({
        wallet: contact.wallet,
        campaign_id: campaignId,
        nft_address: asset?.id,
        signature: txSignature,
        status: "success",
      })
    })

    await io.logger.info("✨ Congratulations, You just ran your first successful Trigger.dev Job! ✨")
  },
})
