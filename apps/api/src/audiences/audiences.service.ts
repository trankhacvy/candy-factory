import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Like, Raw, Repository } from 'typeorm';
import { Audience } from './entities/audience.entity';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { NullableType } from 'src/utils/types/nullable.type';
import { AudienceGroupsService } from 'src/audience-groups/audience-groups.service';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageMetaDto } from 'src/utils/dtos/page-meta.dto';
import { PageDto } from 'src/utils/dtos/page.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AudiencesService {
  constructor(
    @InjectRepository(Audience)
    private audiencesRepository: Repository<Audience>,
    @Inject(forwardRef(() => AudienceGroupsService))
    private audienceGroupsService: AudienceGroupsService,
  ) {}

  async create({ groupId, wallet }: CreateAudienceDto): Promise<Audience> {
    const group = await this.audienceGroupsService.findOne({ id: groupId });

    return this.audiencesRepository.save(
      this.audiencesRepository.create({
        wallet,
        group,
      }),
    );
  }

  async bulkCreate(dto: CreateAudienceDto[]): Promise<Audience[]> {
    const group = await this.audienceGroupsService.findOne({
      id: dto[0].groupId,
    });

    return this.audiencesRepository.save(
      this.audiencesRepository.create(
        dto.map((item) => ({
          wallet: item.wallet,
          group,
        })),
      ),
    );
  }

  update(
    id: Audience['id'],
    payload: DeepPartial<Audience>,
  ): Promise<Audience> {
    return this.audiencesRepository.save(
      this.audiencesRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: Audience['id']): Promise<void> {
    const wallet = await this.findOne({ id });
    if (!wallet) throw new NotFoundException('Wallet not found');

    await Promise.all([
      this.audiencesRepository.softDelete(id),
      this.audienceGroupsService.decreaseAudience(wallet.groupId),
    ]);
  }

  findManyWithPagination(
    paginationOptions: IPaginationOptions,
  ): Promise<Audience[]> {
    return this.audiencesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  findOne(fields: EntityCondition<Audience>): Promise<NullableType<Audience>> {
    return this.audiencesRepository.findOne({
      where: fields,
    });
  }

  findByGroupId(id: AudienceGroup['id']): Promise<Audience[]> {
    return this.audiencesRepository.find({
      where: {
        groupId: id,
      },
    });
  }

  async findByGroupIdPagination(
    id: AudienceGroup['id'],
    dto: PageOptionsDto,
  ): Promise<PageDto<Audience>> {
    const [result, total] = await this.audiencesRepository.findAndCount({
      where: {
        wallet: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:wallet)`, {
          wallet: `%${dto.q}%`,
        }),
        groupId: id,
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

  async getTotalWallet(user: User): Promise<number> {
    const result = await this.audiencesRepository.findAndCount({
      where: {
        group: {
          userId: user.id,
        },
      },
    });

    return result[1];
  }
}
