import { Module } from '@nestjs/common';
import { StatService } from './StatsServices';
import { StatController } from './StatsController';
import { DropsModule } from 'src/drops/drops.module';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';
import { AudiencesModule } from 'src/audiences/audiences.module';

@Module({
  imports: [DropsModule, AudiencesModule],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService],
})
export class StatModule {}
