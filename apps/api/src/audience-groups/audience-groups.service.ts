import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsOrder, Raw, Repository } from 'typeorm';
import {
  AudienceGroup,
  WalletsGroupStatus,
} from './entities/audience-group.entity';
import {
  CreateAudienceGroupDto,
  CreateAudienceGroupWithCsvDto,
  CreateAudienceGroupWithCollectionDto,
} from './dto/create-group.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { AudiencesService } from 'src/audiences/audiences.service';
import { Audience } from 'src/audiences/entities/audience.entity';
import { User } from 'src/users/entities/user.entity';
import { initGroups } from 'src/utils/wallet';
import { getCsvFileFromFileName } from 'src/utils/csv-helper';
import { ICsvRecord } from 'src/utils/types/csv-record.type';
import { isPublicKey } from 'src/utils/validators/is-public-key';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageDto } from 'src/utils/dtos/page.dto';
import { PageMetaDto } from 'src/utils/dtos/page-meta.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JOBS_QUEUE, JobTypes } from 'src/utils/job';

@Injectable()
export class AudienceGroupsService {
  constructor(
    @InjectRepository(AudienceGroup)
    private audienceGroupsRepository: Repository<AudienceGroup>,
    @Inject(forwardRef(() => AudiencesService))
    private audiencesService: AudiencesService,
    @InjectQueue(JOBS_QUEUE) private readonly jobsQueue: Queue,
  ) {}

  async create(
    dto: CreateAudienceGroupDto,
    user: User,
  ): Promise<AudienceGroup> {
    const group = await this.audienceGroupsRepository.save(
      this.audienceGroupsRepository.create({
        ...dto,
        numOfAudience: dto.audiences.length,
        user,
        status: WalletsGroupStatus.FINISH,
      }),
    );

    await this.audiencesService.bulkCreate(
      dto.audiences.map((aud) => ({
        wallet: aud.wallet,
        groupId: group.id,
      })),
    );

    return group;
  }

  async createWithCsv(
    dto: CreateAudienceGroupWithCsvDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<AudienceGroup> {
    try {
      const results = (await getCsvFileFromFileName(
        file.buffer,
      )) as ICsvRecord[];

      if (results.length === 0) {
        throw new UnprocessableEntityException('Invalid CSV file');
      }

      const validRecords = results.filter((item) => isPublicKey(item.Wallets));

      const group = await this.audienceGroupsRepository.save(
        this.audienceGroupsRepository.create({
          ...dto,
          numOfAudience: validRecords.length,
          user,
          status: WalletsGroupStatus.FINISH,
        }),
      );

      await this.audiencesService.bulkCreate(
        validRecords.map((record) => ({
          wallet: record.Wallets,
          groupId: group.id,
        })),
      );

      return group;
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message || 'Server error');
    }
  }

  async createWithCollection(
    dto: CreateAudienceGroupWithCollectionDto,
    user: User,
  ): Promise<AudienceGroup> {
    try {
      const group = await this.audienceGroupsRepository.save(
        this.audienceGroupsRepository.create({
          ...dto,
          numOfAudience: 0,
          user,
        }),
      );

      this.jobsQueue.add(JobTypes.WalletsGroup, {
        groupId: group.id,
        collection: dto.collection,
      });

      return group;
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message || 'Server error');
    }
  }

  async initGroupsWallet(user: User): Promise<void> {
    for (const item of initGroups) {
      const group = await this.audienceGroupsRepository.save(
        this.audienceGroupsRepository.create({
          name: item.name,
          isFavorite: true,
          numOfAudience: item.addresses.length,
          user,
        }),
      );

      await this.audiencesService.bulkCreate(
        item.addresses.map((wallet) => ({
          wallet,
          groupId: group.id,
        })),
      );
    }
  }

  async update(
    id: AudienceGroup['id'],
    payload: DeepPartial<AudienceGroup>,
  ): Promise<AudienceGroup> {
    await this.findOne({ id });

    return this.audienceGroupsRepository.save(
      this.audienceGroupsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: AudienceGroup['id']): Promise<void> {
    const group = await this.audienceGroupsRepository.findOneOrFail({
      where: { id },
      relations: ['members'],
    });
    await this.audienceGroupsRepository.softRemove(group);
  }

  async findManyWithPagination(
    dto: PageOptionsDto,
    where?: EntityCondition<AudienceGroup>,
    order: FindOptionsOrder<AudienceGroup> = { createdAt: dto.order },
  ): Promise<PageDto<AudienceGroup>> {
    const [result, total] = await this.audienceGroupsRepository.findAndCount({
      where: [
        {
          name: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
            name: `%${dto.q}%`,
          }),
          ...where,
        },
      ],
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

  async findOne(
    fields: EntityCondition<AudienceGroup>,
  ): Promise<AudienceGroup> {
    const group = await this.audienceGroupsRepository.findOne({
      where: fields,
    });

    if (!group) throw new NotFoundException('Group not found');

    return group;
  }

  async increaseAudience(id: AudienceGroup['id']): Promise<AudienceGroup> {
    const group = await this.findOne({ id });
    group.numOfAudience++;
    return this.audienceGroupsRepository.save(group);
  }

  async decreaseAudience(id: AudienceGroup['id']): Promise<AudienceGroup> {
    const group = await this.findOne({ id });
    group.numOfAudience--;
    return this.audienceGroupsRepository.save(group);
  }

  async findAudiencesByGroup(id: AudienceGroup['id']): Promise<Audience[]> {
    return this.audiencesService.findByGroupId(id);
  }

  async findAudiencesByGroupPagination(
    id: AudienceGroup['id'],
    dto: PageOptionsDto,
  ): Promise<PageDto<Audience>> {
    return this.audiencesService.findByGroupIdPagination(id, dto);
  }
}
