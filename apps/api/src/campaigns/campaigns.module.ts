import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './entities/campaigns.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { CampaignTransaction } from './entities/campaign-transactions.entity';
import { NFTsModule } from 'src/nfts/nfts.module';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, CampaignTransaction]),
    NFTsModule,
    AudienceGroupsModule,
  ],
  controllers: [CampaignsController],
  providers: [IsExist, IsNotExist, CampaignsService],
  exports: [CampaignsService],
})
export class CampaignsModule {}
