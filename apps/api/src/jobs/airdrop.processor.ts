import {
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { ConnectionService } from 'src/shared/services/connection-service';
import { MintNFTService } from 'src/shared/services/nft-mint-service';
import {
  AirdropJobData,
  AirdropToCollectionJobData,
  JOBS_QUEUE,
  JobTypes,
} from 'src/utils/job';
import { NFTsService } from 'src/nfts/nfts.service';
import { DropsService } from 'src/drops/drops.service';
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from '@metaplex-foundation/mpl-bubblegum';
import { PublicKey } from '@solana/web3.js';
import { DropTransactionsService } from 'src/drops/drop-transactions.service';
import { DropTxStatus } from 'src/drops/entities/drop-transaction.entity';
import { CollectionService } from 'src/shared/services/collection-service';

@Processor(JOBS_QUEUE)
export class AirdropProcessor {
  private readonly logger = new Logger(AirdropProcessor.name);

  constructor(
    private nftsService: NFTsService,
    private connectionService: ConnectionService,
    private collectionService: CollectionService,
    private mintNFTService: MintNFTService,
    private dropsService: DropsService,
    private dropTransactionsService: DropTransactionsService,
  ) {}

  @Process({ name: JobTypes.Airdrop, concurrency: 1 })
  async job(job: Job<AirdropJobData>) {
    this.logger.log(
      `Start job to airdrop drop Id: ${job.data.dropId}, NFT: ${job.data.nftId}, Drop Tx: ${job.data.dropTxId}`,
    );

    const nft = await this.nftsService.findOne({ id: job.data.nftId });
    if (nft.isCollection || !nft.collectionId)
      return { nftAddress: '', signature: '' };

    const collection = await this.nftsService.findOne({ id: nft.collectionId });
    if (!collection) return { nftAddress: '', signature: '' };

    const tx = await this.dropTransactionsService.findOne({
      id: job.data.dropTxId,
    });

    const connection = this.connectionService.getConnection();
    const payer = this.connectionService.feePayer;
    const tree = this.connectionService.tree;

    const metadata: MetadataArgs = {
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.metadataUri,
      creators:
        Array.isArray(nft.creators) && nft.creators.length > 0
          ? [
              ...nft.creators.map((c) => ({
                address: new PublicKey(c.address),
                verified: false,
                share: c.share,
              })),
              {
                address: payer.publicKey,
                verified: false,
                share: 0,
              },
            ]
          : [
              {
                address: payer.publicKey,
                verified: false,
                share: 100,
              },
            ].filter(Boolean),
      editionNonce: 0,
      uses: null,
      collection: null,
      primarySaleHappened: false,
      sellerFeeBasisPoints: 0,
      isMutable: false,
      // these values are taken from the Bubblegum package
      tokenProgramVersion: TokenProgramVersion.Original,
      tokenStandard: TokenStandard.NonFungible,
    };

    const { mint: mintAddress, signature } =
      await this.mintNFTService.mintCompressedNFTV2(
        connection,
        payer,
        tree,
        new PublicKey(collection.collectionAddress as string),
        new PublicKey(collection?.collectionKeys?.metadataAccount as string),
        new PublicKey(
          collection?.collectionKeys?.masterEditionAccount as string,
        ),
        metadata,
        new PublicKey(tx.wallet),
      );

    this.logger.debug('mint success', signature);
    return { nftAddress: mintAddress, signature };
  }

  @Process({ name: JobTypes.AirdropToCollection })
  async jobAirdropToCollection(job: Job<AirdropToCollectionJobData>) {
    this.logger.log(
      `Start job load holders for the collection ${job.data.collection} then airdrop for drop: ${job.data.dropId}`,
    );

    const holders = await this.collectionService.loadHoldersOfCollection(
      job.data.collection,
    );

    return holders.map((h) => h.address);
  }

  @OnQueueCompleted({ name: JobTypes.Airdrop })
  onCompleted(
    job: Job<AirdropJobData>,
    result: { nftAddress: string; signature: string },
  ) {
    this.logger.log(
      `Job to airdrop drop Id: ${job.data.dropId}, NFT: ${job.data.nftId}, Drop Tx: ${job.data.dropTxId} has been completed with the result: ${result.nftAddress}`,
    );

    if (result.nftAddress && result.signature) {
      Promise.all([
        this.dropTransactionsService.update(job.data.dropTxId, {
          nftAddress: result.nftAddress,
          signature: result.signature,
          status: DropTxStatus.SUCCESS,
        }),
        this.dropsService.increaseMintedNFT(job.data.dropId, 1),
      ]);
    }
  }

  @OnQueueCompleted({ name: JobTypes.AirdropToCollection })
  async onCompleted1(job: Job<AirdropToCollectionJobData>, result: string[]) {
    if (result.length > 0) {
      const drop = await this.dropsService.findOne({ id: job.data.dropId });
      await this.dropsService.update(job.data.dropId, {
        numOfNft: result.length,
      });
      await this.dropsService.createBulkDropTxs(drop, result);
    }
  }

  @OnQueueFailed({ name: JobTypes.Airdrop })
  onQueueFailed(job: Job, error) {
    this.logger.log(`Job ${job.name} error`, error);
  }
}
