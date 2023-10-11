import { Process, Processor } from '@nestjs/bull';
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

@Processor('airdrop')
export class AirdropProcessor {
  private readonly logger = new Logger(AirdropProcessor.name);

  constructor(
    @InjectRepository(Drop)
    private dropsRepository: Repository<Drop>,
    @InjectRepository(DropTransaction)
    private dropTxsRepository: Repository<DropTransaction>,
    // private nftsService: NFTsService,
    // private audienceGroupsService: AudienceGroupsService,
    private connectionService: ConnectionService,
    private mintNFTService: MintNFTService,
  ) {}

  @Process({ name: 'drop', concurrency: 5 })
  async handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    // this.logger.debug(job.data);

    const nft = job.data.nft as NFT;
    const drop = job.data.drop as Drop;
    const tx = job.data.tx as DropTransaction;
    const collection = job.data.collection as any;

    if (!nft || !drop || !tx || !collection) {
      console.log('NO data ==============>');

      return;
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

    Promise.all([
      this.dropTxsRepository.save(
        this.dropTxsRepository.create({
          id: tx.id,
          nftAddress: mintAddress,
          signature,
          status: DropTxStatus.SUCCESS,
          drop,
        }),
      ),
      this.dropsRepository.increment({ id: drop.id }, 'mintedNft', 1),
    ]);

    this.logger.debug('Transcoding completed');
  }
}
