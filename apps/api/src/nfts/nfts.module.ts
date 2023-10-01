import { Module } from '@nestjs/common';
import { NFTsService } from './nfts.service';
import { NFTsController } from './nfts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NFT } from './entities/nft.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [TypeOrmModule.forFeature([NFT])],
  controllers: [NFTsController],
  providers: [IsExist, IsNotExist, NFTsService],
  exports: [NFTsService],
})
export class NFTsModule {}
