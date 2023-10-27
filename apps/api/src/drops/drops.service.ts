import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsOrder, Raw, Repository } from 'typeorm';
import { Drop, DropWalletsSource } from './entities/drop.entity';
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
import { User } from 'src/users/entities/user.entity';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageMetaDto } from 'src/utils/dtos/page-meta.dto';
import { PageDto } from 'src/utils/dtos/page.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/config/config.type';
import { EstimatePriceDto } from './dto/estimate-price.dto';
import { CollectionService } from 'src/shared/services/collection-service';
import { roundNumber } from 'src/utils/number';
import { EstimatePriceResponseDto } from './dto/estimate-price-response.dto';
import { PythService } from 'src/shared/services/pyth-service';
import { JOBS_QUEUE, JobTypes } from 'src/utils/job';

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
    private collectionService: CollectionService,
    private pythService: PythService,
    private mintNFTService: MintNFTService,
    @InjectQueue(JOBS_QUEUE) private readonly airdropQueue: Queue,
    private configService: ConfigService<AllConfigType>,
  ) {}

  /**
   * create a drop
   *
   * if drop load wallets from group
   * --- find group, get all wallet -> mint nfts
   *
   * if drop load wallets from collection
   * --- load all collection holders -> take many time
   * --- insert wallets to db
   * --- start mint nft
   *
   * @param param0
   * @param user
   * @returns
   */
  async create(
    { name, nftId, groupId, collection, transactionId }: CreateDropDto,
    user: User,
  ): Promise<Drop> {
    if (!groupId && !collection)
      throw new BadRequestException('You need provide groupId or collection');

    let drop;

    const nft = await this.nftsService.findOne({ id: nftId });

    const dropInfo: Partial<Drop> = {
      name,
      nft,
      user,
      mintedNft: 0,
      transactionId,
    };

    if (collection) {
      dropInfo.walletsSource = DropWalletsSource.COLLECTION;
      dropInfo.collection = collection;

      drop = await this.dropsRepository.save(
        this.dropsRepository.create(dropInfo),
      );

      this.airdropQueue.add(JobTypes.AirdropToCollection, {
        dropId: drop.id,
        collection,
      });
    } else {
      const audiences = await this.audienceGroupsService.findAudiencesByGroup(
        groupId!,
      );

      const wallets = audiences.map((aud) => aud.wallet);

      dropInfo.walletsSource = DropWalletsSource.GROUP;
      dropInfo.groupId = groupId;
      dropInfo.numOfNft = audiences.length;

      drop = await this.dropsRepository.save(
        this.dropsRepository.create(dropInfo),
      );

      this.createBulkDropTxs(drop, wallets);
    }

    return drop;
  }

  async estimatePrice({
    groupId,
    collection,
  }: EstimatePriceDto): Promise<EstimatePriceResponseDto> {
    if (groupId) {
      const audiences =
        await this.audienceGroupsService.findAudiencesByGroup(groupId);

      const priceInUSD = roundNumber(
        this.configService.getOrThrow('solana.nftPrice', { infer: true }) *
          audiences.length,
      );

      const priceInSol = await this.pythService.convertUSDToSol(priceInUSD);
      console.log('priceInSol', priceInSol.toString());

      if (priceInSol <= 0)
        throw new InternalServerErrorException('Unknown error');

      return {
        totalWallets: audiences.length,
        price: roundNumber(priceInSol, 10 ** 5),
      };
    } else {
      const holders = await this.collectionService.loadHoldersOfCollection(
        collection!,
      );

      const priceInUSD = roundNumber(
        this.configService.getOrThrow('solana.nftPrice', { infer: true }) *
          holders.length,
      );

      const priceInSol = await this.pythService.convertUSDToSol(priceInUSD);

      if (priceInSol <= 0)
        throw new InternalServerErrorException('Unknown error');

      return {
        totalWallets: holders.length,
        price: roundNumber(priceInSol, 10 ** 5),
      };
    }
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
        createdAt: 'DESC',
      },
    });

    return transactions;
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

  async getTotalAirdropedNFT(user: User): Promise<number> {
    const result = await this.dropTxsRepository.findAndCount({
      where: {
        drop: {
          userId: user.id,
        },
      },
    });

    return result[1];
  }

  async createBulkDropTxs(drop: Drop, wallets: string[]): Promise<boolean> {
    // insert all wallets
    await this.dropTxsRepository.save(
      this.dropTxsRepository.create(
        wallets.map((wallet) => ({
          wallet,
          status: DropTxStatus.PROCESSING,
          drop,
        })),
      ),
    );

    const nft = await this.nftsService.findOne({
      id: drop.nftId,
    });

    const transactions = await this.findTransactions(drop.id);

    this.airdropQueue.addBulk(
      transactions.map((tx) => ({
        name: JobTypes.Airdrop,
        data: {
          nftId: nft.id,
          dropId: drop.id,
          dropTxId: tx.id,
        },
        opts: {
          jobId: `airdrop_${tx.id}`,
        },
      })),
    );

    return true;
  }

  async increaseMintedNFT(id: number, count: number) {
    return this.dropsRepository.increment({ id }, 'mintedNft', count);
  }
}
