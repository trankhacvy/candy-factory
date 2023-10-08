import { Module } from '@nestjs/common';
import { DropsService } from './drops.service';
import { DropsController } from './drops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drop } from './entities/drop.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { DropTransaction } from './entities/drop-transaction.entity';
import { NFTsModule } from 'src/nfts/nfts.module';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Drop, DropTransaction]),
    NFTsModule,
    AudienceGroupsModule,
  ],
  controllers: [DropsController],
  providers: [IsExist, IsNotExist, DropsService],
  exports: [DropsService],
})
export class DropsModule {}
