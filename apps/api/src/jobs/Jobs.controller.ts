import { InjectQueue } from '@nestjs/bull';
import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Queue } from 'bull';
import { JOBS_QUEUE, JobTypes } from 'src/utils/job';

@ApiTags('Jobs')
@Controller({
  path: 'jobs',
  version: '1',
})
export class JobsController {
  constructor(@InjectQueue(JOBS_QUEUE) private jobsQueue: Queue) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async getStat() {
    const job = await this.jobsQueue.add(JobTypes.Airdrop, {
      foo: 'bar',
    });

    console.log('add job success', job);

    return { success: true };
  }
}
