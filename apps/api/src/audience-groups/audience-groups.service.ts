import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { AudienceGroup } from './entities/audience-group.entity';
import {
  CreateAudienceGroupDto,
  CreateAudienceGroupWithCsvDto,
} from './dto/create-group.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { AudiencesService } from 'src/audiences/audiences.service';
import { Audience } from 'src/audiences/entities/audience.entity';
import { User } from 'src/users/entities/user.entity';
import { sampleWallets } from 'src/utils/wallet';
import { getCsvFileFromFileName } from 'src/utils/csv-helper';
import { ICsvRecord } from 'src/utils/types/csv-record.type';
import { isPublicKey } from 'src/utils/validators/is-public-key';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageDto } from 'src/utils/dtos/page.dto';

@Injectable()
export class AudienceGroupsService {
  constructor(
    @InjectRepository(AudienceGroup)
    private audienceGroupsRepository: Repository<AudienceGroup>,
    @Inject(forwardRef(() => AudiencesService))
    private audiencesService: AudiencesService,
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

      console.log('results', results);

      const group = await this.audienceGroupsRepository.save(
        this.audienceGroupsRepository.create({
          ...dto,
          numOfAudience: validRecords.length,
          user,
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

  async createDemo(
    dto: CreateAudienceGroupDto,
    user: User,
  ): Promise<AudienceGroup> {
    const group = await this.audienceGroupsRepository.save(
      this.audienceGroupsRepository.create({
        ...dto,
        numOfAudience: sampleWallets.addresses.length,
        user,
      }),
    );

    await this.audiencesService.bulkCreate(
      sampleWallets.addresses.map((wallet) => ({
        wallet,
        groupId: group.id,
      })),
    );

    return group;
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
    await this.findOne({ id });
    await this.audienceGroupsRepository.softDelete(id);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
    where?: EntityCondition<AudienceGroup>,
  ): Promise<AudienceGroup[]> {
    return this.audienceGroupsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where,
    });
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

  async findAudiencesByGroupPagination(id: AudienceGroup['id'], dto: PageOptionsDto): Promise<PageDto<Audience>> {
    return this.audiencesService.findByGroupIdPagination(id, dto);
  }
}
