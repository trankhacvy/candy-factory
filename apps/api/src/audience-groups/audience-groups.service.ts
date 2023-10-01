import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { AudienceGroup } from './entities/audience-group.entity';
import { CreateAudienceGroupDto } from './dto/create-group.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { AudiencesService } from 'src/audiences/audiences.service';
import { Audience } from 'src/audiences/entities/audience.entity';

@Injectable()
export class AudienceGroupsService {
  constructor(
    @InjectRepository(AudienceGroup)
    private audienceGroupsRepository: Repository<AudienceGroup>,
    @Inject(forwardRef(() => AudiencesService))
    private audiencesService: AudiencesService,
  ) {}

  create(dto: CreateAudienceGroupDto): Promise<AudienceGroup> {
    return this.audienceGroupsRepository.save(
      this.audienceGroupsRepository.create(dto),
    );
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
  ): Promise<AudienceGroup[]> {
    return this.audienceGroupsRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
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
}
