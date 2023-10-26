import { Module } from '@nestjs/common';
import { SetupService } from './SetupService';
import { SetupController } from './SetupController';
import { UsersModule } from 'src/users/users.module';
import { NFTsModule } from 'src/nfts/nfts.module';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';

@Module({
  imports: [UsersModule, NFTsModule, AudienceGroupsModule],
  controllers: [SetupController],
  providers: [SetupService],
  exports: [SetupService],
})
export class SetupModule {}
