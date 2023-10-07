import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PromisePool } from '@supercharge/promise-pool';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Campaign } from './entities/campaigns.entity';
import { CreateCampaignDto } from './dto/create-campaigns.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NFTsService } from 'src/nfts/nfts.service';
import { AudienceGroupsService } from 'src/audience-groups/audience-groups.service';
import {
  CampaignTransaction,
  CampaignTxStatus,
} from './entities/campaign-transactions.entity';
import { MintNFTService } from 'src/shared/services/nft-mint-service';
import { ConnectionService } from 'src/shared/services/connection-service';
import { PublicKey } from '@solana/web3.js';
import {
  MetadataArgs,
  TokenProgramVersion,
  TokenStandard,
} from '@metaplex-foundation/mpl-bubblegum';
import { CreateMetadataAccountArgsV3 } from '@metaplex-foundation/mpl-token-metadata';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private campaignsRepository: Repository<Campaign>,
    @InjectRepository(CampaignTransaction)
    private campaignTxsRepository: Repository<CampaignTransaction>,
    private nftsService: NFTsService,
    private audienceGroupsService: AudienceGroupsService,
    private connectionService: ConnectionService,
    private mintNFTService: MintNFTService,
  ) {}

  async create(
    { name, nftId, groupId }: CreateCampaignDto,
    user: User,
  ): Promise<Campaign> {
    const nft = await this.nftsService.findOne({ id: nftId });
    const group = await this.audienceGroupsService.findOne({ id: groupId });

    const audiences = await this.audienceGroupsService.findAudiencesByGroup(
      group.id,
    );

    const campaign = await this.campaignsRepository.save(
      this.campaignsRepository.create({
        name,
        nft,
        group,
        user,
        numOfNft: audiences.length,
        mintedNft: 0,
      }),
    );

    await this.campaignTxsRepository.save(
      this.campaignTxsRepository.create(
        audiences.map((aud) => ({
          wallet: aud.wallet,
          status: CampaignTxStatus.PROCESSING,
          campaign: campaign,
        })),
      ),
    );

    this.createBulkCampaignTxs(campaign.id);

    return campaign;
  }

  async update(
    id: Campaign['id'],
    payload: DeepPartial<Campaign>,
  ): Promise<Campaign> {
    await this.findOne({ id });

    return this.campaignsRepository.save(
      this.campaignsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Campaign['id']): Promise<void> {
    await this.findOne({ id });

    await this.campaignsRepository.softDelete(id);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    where?: EntityCondition<Campaign>,
  ): Promise<Campaign[]> {
    return this.campaignsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
    });
  }

  async findOne(fields: EntityCondition<Campaign>): Promise<Campaign> {
    const campaign = await this.campaignsRepository.findOne({
      where: fields,
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async findTransactions(id: number): Promise<CampaignTransaction[]> {
    const campaign = await this.findOne({ id });

    const transactions = await this.campaignTxsRepository.find({
      where: {
        campaignId: campaign.id,
      },
    });

    return transactions;
  }

  async createBulkCampaignTxs(campaignId: Campaign['id']): Promise<boolean> {
    const campaign = await this.findOne({ id: campaignId });
    if (!campaign.nft || !campaign.group)
      throw new InternalServerErrorException('Invalid campaign');

    const transactions = await this.findTransactions(campaign.id);

    console.log('transactions: ', transactions.length);

    const connection = this.connectionService.getConnection();
    const payer = this.connectionService.feePayer;
    const tree = this.connectionService.tree;
    const nft = campaign.nft;

    const collectionMetadata: CreateMetadataAccountArgsV3 = {
      data: {
        name: nft.collectionName ?? '',
        symbol: nft.collectionSymbol ?? '',
        uri: nft.collectionMetadataUri ?? '',
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: payer.publicKey,
            verified: false,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
      },
      isMutable: false,
      collectionDetails: null,
    };

    // console.log('collectionMetadata: ', collectionMetadata);

    let mint: PublicKey | null = null;
    let metadataAccount: PublicKey | null = null;
    let masterEditionAccount: PublicKey | null = null;

    try {
      let result = await this.mintNFTService.mintCollection(collectionMetadata);

      mint = result.mint;
      metadataAccount = result.metadataAccount;
      masterEditionAccount = result.masterEditionAccount;
    } catch (error) {
      console.error(error);
      throw error;
    }

    if (!mint || !metadataAccount || !masterEditionAccount) return false;

    // console.log('mint: ', mint);
    // console.log('metadataAccount: ', metadataAccount);
    // console.log('masterEditionAccount: ', masterEditionAccount);

    await PromisePool.for(transactions)
      .withConcurrency(5)
      .process(async (tx) => {
        try {
          // mint nft
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

          // console.log('metadata: ', metadata);

          const signature = await this.mintNFTService.mintCompressedNFT(
            connection,
            payer,
            tree,
            new PublicKey(mint!),
            new PublicKey(metadataAccount!),
            new PublicKey(masterEditionAccount!),
            metadata,
            new PublicKey(tx.wallet),
          );

          console.log('signature: ', signature);

          // update to db

          Promise.all([
            this.campaignTxsRepository.save(
              this.campaignTxsRepository.create({
                id: tx.id,
                nftAddress: '',
                signature,
                status: CampaignTxStatus.SUCCESS,
                campaign,
              }),
            ),
            this.campaignsRepository.increment(
              { id: campaign.id },
              'mintedNft',
              1,
            ),
          ]);
        } catch (error: any) {
          return this.campaignTxsRepository.save(
            this.campaignTxsRepository.create({
              id: tx.id,
              status: CampaignTxStatus.FAILED,
            }),
          );
        }
      });

    return true;
  }
}
