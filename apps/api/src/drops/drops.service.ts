import { Injectable, NotFoundException } from '@nestjs/common';
import { PromisePool } from '@supercharge/promise-pool';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsOrder, Like, Raw, Repository } from 'typeorm';
import { Drop } from './entities/drop.entity';
import { CreateDropDto } from './dto/create-drop.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NFTsService } from 'src/nfts/nfts.service';
import { AudienceGroupsService } from 'src/audience-groups/audience-groups.service';
import {
  DropTransaction,
  DropTxStatus,
} from './entities/drop-transaction.entity';
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
import { Order, PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageMetaDto } from 'src/utils/dtos/page-meta.dto';
import { PageDto } from 'src/utils/dtos/page.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { AllConfigType, AppConfig } from 'src/config/config.type';

@Injectable()
export class DropsService {
  constructor(
    @InjectRepository(Drop)
    private dropsRepository: Repository<Drop>,
    @InjectRepository(DropTransaction)
    private dropTxsRepository: Repository<DropTransaction>,
    private nftsService: NFTsService,
    private audienceGroupsService: AudienceGroupsService,
    private connectionService: ConnectionService,
    private mintNFTService: MintNFTService,
    @InjectQueue('airdrop') private readonly airdropQueue: Queue,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async create(
    { name, nftId, groupId }: CreateDropDto,
    user: User,
  ): Promise<Drop> {
    const nft = await this.nftsService.findOne({ id: nftId });
    const group = await this.audienceGroupsService.findOne({ id: groupId });

    const audiences = await this.audienceGroupsService.findAudiencesByGroup(
      group.id,
    );

    const drop = await this.dropsRepository.save(
      this.dropsRepository.create({
        name,
        nft,
        group,
        user,
        numOfNft: audiences.length,
        mintedNft: 0,
      }),
    );

    await this.dropTxsRepository.save(
      this.dropTxsRepository.create(
        audiences.map((aud) => ({
          wallet: aud.wallet,
          status: DropTxStatus.PROCESSING,
          drop: drop,
        })),
      ),
    );

    this.createBulkDropTxs(drop.id);

    return drop;
  }

  async getDropPrice({ nftId, groupId }: CreateDropDto): Promise<number> {
    const nft = await this.nftsService.findOne({ id: nftId });
    const group = await this.audienceGroupsService.findOne({ id: groupId });

    const audiences = await this.audienceGroupsService.findAudiencesByGroup(
      group.id,
    );

    return (
      audiences.length *
      this.configService.getOrThrow('solana.nftPrice', { infer: true })
    );
  }

  async update(id: Drop['id'], payload: DeepPartial<Drop>): Promise<Drop> {
    await this.findOne({ id });

    return this.dropsRepository.save(
      this.dropsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Drop['id']): Promise<void> {
    await this.findOne({ id });

    await this.dropsRepository.softDelete(id);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    where?: EntityCondition<Drop>,
  ): Promise<Drop[]> {
    return this.dropsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
    });
  }

  async findAll(
    dto: PageOptionsDto,
    where?: EntityCondition<Drop>,
    order: FindOptionsOrder<Drop> = { createdAt: dto.order },
  ) {
    const [result, total] = await this.dropsRepository.findAndCount({
      where: {
        name: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
          name: `%${dto.q}%`,
        }),
        ...where,
      },
      order: { createdAt: dto.order },
      take: dto.take,
      skip: dto.skip,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: dto,
    });

    return new PageDto(result, pageMetaDto);
  }

  async findOne(fields: EntityCondition<Drop>): Promise<Drop> {
    const drop = await this.dropsRepository.findOne({
      where: fields,
    });

    if (!drop) {
      throw new NotFoundException('Drop not found');
    }

    return drop;
  }

  async findTransactions(id: number): Promise<DropTransaction[]> {
    const drop = await this.findOne({ id });

    const transactions = await this.dropTxsRepository.find({
      where: {
        dropId: drop.id,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    return transactions;
  }

  async createBulkDropTxs(dropId: Drop['id']): Promise<boolean> {
    const currentJob = await this.airdropQueue.getActiveCount();
    console.log('===================? :', currentJob);

    const drop = await this.findOne({ id: dropId });
    const nft = await this.nftsService.findOne({
      id: drop.nftId,
    });

    const transactions = await this.findTransactions(drop.id);

    console.log('transactions: ', transactions.length);

    const payer = this.connectionService.feePayer;

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

    console.log('collectionMetadata: ', collectionMetadata);

    let collectionMint: PublicKey | null = null;
    let metadataAccount: PublicKey | null = null;
    let masterEditionAccount: PublicKey | null = null;

    try {
      let result = await this.mintNFTService.mintCollection(collectionMetadata);

      collectionMint = result.mint;
      metadataAccount = result.metadataAccount;
      masterEditionAccount = result.masterEditionAccount;
    } catch (error) {
      console.error(error);
      throw error;
    }

    if (!collectionMint || !metadataAccount || !masterEditionAccount)
      return false;

    console.log('Mint collection success');

    this.airdropQueue.addBulk(
      transactions.map((tx) => ({
        name: 'drop',
        data: {
          nft,
          drop,
          tx,
          collection: {
            collectionMint,
            metadataAccount,
            masterEditionAccount,
          },
        },
        opts: {
          removeOnComplete: true,
        },
      })),
    );

    return true;
  }

  async findTransactionsManyWithPagination(
    dto: PageOptionsDto,
    where?: EntityCondition<DropTransaction>,
    order: FindOptionsOrder<DropTransaction> = { createdAt: dto.order },
  ) {
    const [result, total] = await this.dropTxsRepository.findAndCount({
      where: {
        wallet: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
          name: `%${dto.q}%`,
        }),
        ...where,
      },
      order,
      take: dto.take,
      skip: dto.skip,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: dto,
    });

    return new PageDto(result, pageMetaDto);
  }
}
