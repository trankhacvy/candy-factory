import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { CollectionService } from 'src/shared/services/collection-service';
import { JOBS_QUEUE, JobTypes, WalletsGroupJobData } from 'src/utils/job';
import { AudienceGroupsService } from 'src/audience-groups/audience-groups.service';
import { AudiencesService } from 'src/audiences/audiences.service';
import { WalletsGroupStatus } from 'src/audience-groups/entities/audience-group.entity';

@Processor(JOBS_QUEUE)
export class WalletsGroupProcessor {
  private readonly logger = new Logger(WalletsGroupProcessor.name);

  constructor(
    private collectionService: CollectionService,
    private audienceGroupsService: AudienceGroupsService,
    private audiencesService: AudiencesService,
  ) {}

  @Process({ name: JobTypes.WalletsGroup, concurrency: 5 })
  async job(job: Job<WalletsGroupJobData>) {
    this.logger.log(
      `Start job load holders for collection ${job.data.collection} to insert to group: ${job.data.groupId}`,
    );

    const holders = await this.collectionService.loadHoldersOfCollection(
      job.data.collection,
    );

    return holders.map((h) => h.address);
  }

  @OnQueueCompleted({ name: JobTypes.WalletsGroup })
  async onCompleted(job: Job<WalletsGroupJobData>, result: string[]) {
    this.logger.log(
      `Job load holders for collection ${job.data.collection} to insert to group: ${job.data.groupId} has been completed. Number of holders: ${result.length}`,
    );

    if (result.length > 0) {
      const group = await this.audienceGroupsService.findOne({
        id: job.data.groupId,
      });

      await this.audiencesService.bulkCreate(
        result.map((holder) => ({
          wallet: holder,
          groupId: group.id,
        })),
      );

      await this.audienceGroupsService.update(group.id, {
        numOfAudience: result.length,
        status: WalletsGroupStatus.FINISH,
      });
    }
  }
}
