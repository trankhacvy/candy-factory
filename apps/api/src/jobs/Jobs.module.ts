import { Module, forwardRef } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { NFTsModule } from 'src/nfts/nfts.module';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';
import { AirdropProcessor } from './airdrop.processor';
import { JobsController } from './Jobs.controller';
import { BullModule } from '@nestjs/bull';
import { JOBS_QUEUE } from 'src/utils/job';
import { WalletsGroupProcessor } from './wallets-group.processor';
import { AudiencesModule } from 'src/audiences/audiences.module';
import { DropsModule } from 'src/drops/drops.module';

@Module({
  imports: [
    UsersModule,
    NFTsModule,
    DropsModule,
    forwardRef(() => AudienceGroupsModule),
    AudiencesModule,
    BullModule.registerQueue({
      name: JOBS_QUEUE,
    }),
  ],
  controllers: [JobsController],
  providers: [AirdropProcessor, WalletsGroupProcessor],
  exports: [],
})
export class JobsModule {}
