import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Like, Repository } from 'typeorm';
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
    console.log('check dto', dto);
    const group = await this.audienceGroupsService.findOne({
      id: dto[0].groupId,
    });

    console.log('check group', group);
    console.log('check dto', dto);

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
    await this.audiencesRepository.softDelete(id);
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
      // @ts-ignore
      where: {
        wallet: Like('%' + dto.q?.toLowerCase() ?? '' + '%'),
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
}
