import { Module } from '@nestjs/common';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './entities/drop.entity';
import { DropTransaction } from './entities/drop-transaction.entity';
import { NFTsModule } from 'src/nfts/nfts.module';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';
import { BullModule } from '@nestjs/bull';
import { DropTransactionsService } from './drop-transactions.service';
import { JOBS_QUEUE } from 'src/utils/job';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drop, DropTransaction]),
    NFTsModule,
    AudienceGroupsModule,
    BullModule.registerQueue({
      name: JOBS_QUEUE,
    }),
  ],
  controllers: [DropsController],
  providers: [DropsService, DropTransactionsService],
  exports: [DropsService, DropTransactionsService],
})
export class DropsModule {}
