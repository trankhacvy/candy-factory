import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JobDataModel } from 'src/utils/types/job.type';
import { AudienceGroup } from './entities/audience-group.entity';
import { CollectionService } from 'src/shared/services/collection-service';
import { AudiencesService } from 'src/audiences/audiences.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Processor('wallets-group')
export class AudienceGroupProcessor {
  private readonly logger = new Logger(AudienceGroupProcessor.name);

  constructor(
    private collectionService: CollectionService,
    private audiencesService: AudiencesService,
    @InjectRepository(AudienceGroup)
    private audienceGroupsRepository: Repository<AudienceGroup>,
  ) {}

  @Process({ concurrency: 1 })
  async handleJobs(job: Job<JobDataModel<any>>) {
    this.logger.debug('Start job...', job.id, job.data.type);

    if (job.data.type === 'load-collection-holders') {
      return await this.handleLoadCollectionHoldersJob(job);
    }

    return true;
  }

  @OnQueueCompleted()
  onActive(job: Job<JobDataModel<any>>, result: any) {
    this.logger.debug('[OnQueueCompleted] ', job.id, job.data.type);

    if (job.data.type === 'load-collection-holders') {
      return this.handleLoadCollectionHoldersJobSuccess(job, result);
    }
  }

  // ---------------------------------- load holders job
  private async handleLoadCollectionHoldersJob(
    job: Job<
      JobDataModel<{
        group: AudienceGroup;
        collection: string;
      }>
    >,
  ) {
    const {
      data: { payload },
    } = job;

    const holders = await this.collectionService.loadHoldersOfCollection(
      payload.collection,
    );

    return { holders: holders.map((h) => h.address) };
  }

  private async handleLoadCollectionHoldersJobSuccess(
    job: Job<
      JobDataModel<{
        group: AudienceGroup;
        collection: string;
      }>
    >,
    result: { holders: string[] },
  ) {
    const {
      data: { payload },
    } = job;

    if (result.holders.length > 0) {
      Promise.all([
        this.audienceGroupsRepository.increment(
          { id: payload.group.id },
          'numOfAudience',
          result.holders.length,
        ),
        this.audiencesService.bulkCreate(
          result.holders.map((holder) => ({
            wallet: holder,
            groupId: payload.group.id,
          })),
        ),
      ]);
    }
  }
}
