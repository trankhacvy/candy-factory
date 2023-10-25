import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Drop } from './entities/drop.entity';
import { Repository } from 'typeorm';
import {
  DropTransaction,
  DropTxStatus,
} from './entities/drop-transaction.entity';
import { ConnectionService } from 'src/shared/services/connection-service';
import { MintNFTService } from 'src/shared/services/nft-mint-service';
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from '@metaplex-foundation/mpl-bubblegum';
import { NFT } from 'src/nfts/entities/nft.entity';
import { PublicKey } from '@solana/web3.js';
import { JobDataModel } from 'src/utils/types/job.type';
import { CollectionService } from 'src/shared/services/collection-service';
import { DropsService } from './drops.service';

@Processor('airdrop')
export class AirdropProcessor {
  private readonly logger = new Logger(AirdropProcessor.name);

  constructor(
    @InjectRepository(Drop)
    private dropsRepository: Repository<Drop>,
    @InjectRepository(DropTransaction)
    private dropTxsRepository: Repository<DropTransaction>,
    private dropsService: DropsService,
    private connectionService: ConnectionService,
    private mintNFTService: MintNFTService,
    private collectionService: CollectionService,
  ) {}

  @Process({ concurrency: 1 })
  async handleTranscode(job: Job<JobDataModel<any>>) {
    this.logger.debug('Start transcoding...', job.id, job.data.type);

    if (job.data.type === 'airdrop') {
      return await this.handleAirdropJob(job);
    }

    if (job.data.type === 'load_holders') {
      return await this.loadHoldersJob(job);
    }

    return true;
  }

  @OnQueueCompleted()
  onActive(job: Job, result: any) {
    if (job.data.type === 'airdrop') {
      this.handleAirdropJobSuccess(job, result);
    } else if (job.data.type === 'load_holders') {
      this.handleLoadHoldersSuccess(job, result);
    }
  }

  // ---------------------------------- aridrop job
  private async handleAirdropJob(
    job: Job<
      JobDataModel<{
        nft: NFT;
        drop: Drop;
        tx: DropTransaction;
        collection: any;
      }>
    >,
  ) {
    const {
      data: { payload },
    } = job;

    const nft = payload.nft;
    const drop = payload.drop;
    const tx = payload.tx;
    const collection = payload.collection as any;

    if (!nft || !drop || !tx || !collection) {
      console.log('NO data ==============>');

      return true;
    }

    const connection = this.connectionService.getConnection();
    const payer = this.connectionService.feePayer;
    const tree = this.connectionService.tree;

    const metadata: MetadataArgs = {
      name: nft.name,
      symbol: nft.symbol,
      uri: nft.metadataUri,
      // @ts-ignore
      creators: [
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
        new PublicKey(collection.collectionMint!),
        new PublicKey(collection.metadataAccount!),
        new PublicKey(collection.masterEditionAccount!),
        metadata,
        new PublicKey(tx.wallet),
      );

    console.log('mint success:', mintAddress);

    this.logger.debug('Transcoding completed');

    return { id: tx.id, nftAddress: mintAddress, signature };
  }

  private async handleAirdropJobSuccess(
    job: Job<
      JobDataModel<{
        nft: NFT;
        drop: Drop;
        tx: DropTransaction;
        collection: any;
      }>
    >,
    result: any,
  ) {
    const {
      data: { payload },
    } = job;

    const { id, nftAddress, signature } = result;

    if (!id || !nftAddress || !signature) return;

    Promise.all([
      this.dropTxsRepository.save(
        this.dropTxsRepository.create({
          id,
          nftAddress,
          signature,
          status: DropTxStatus.SUCCESS,
          drop: payload.drop,
        }),
      ),
      this.dropsRepository.increment({ id: payload.drop.id }, 'mintedNft', 1),
    ]);
  }

  // ----------------------- load holders job
  private async loadHoldersJob(
    job: Job<
      JobDataModel<{
        drop: Drop;
        collection: string;
      }>
    >,
  ) {
    const { collection } = job.data.payload;
    this.logger.debug('Start fetching holder for collection: ' + collection);

    const holders =
      await this.collectionService.loadHoldersOfCollection(collection);

    this.logger.debug('loadHoldersJob success: ', holders.length);

    return { holders };
  }

  private async handleLoadHoldersSuccess(
    job: Job<
      JobDataModel<{
        drop: Drop;
        collection: string;
      }>
    >,
    result: any,
  ) {
    const { drop } = job.data.payload;
    const { holders } = result;

    if (!holders || holders.length === 0) return;

    const wallets = holders.map((holder) => holder.address);

    await this.dropsService.update(drop.id, { numOfNft: wallets.length });

    this.dropsService.createBulkDropTxs(drop, wallets);
  }
}
