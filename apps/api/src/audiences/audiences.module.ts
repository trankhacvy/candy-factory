import { Module, forwardRef } from '@nestjs/common';
import { AudiencesService } from './audiences.service';
import { AudiencesController } from './audiences.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Audience } from './entities/audience.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { AudienceGroupsModule } from 'src/audience-groups/audience-groups.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Audience]),
    forwardRef(() => AudienceGroupsModule),
  ],
  controllers: [AudiencesController],
  providers: [IsExist, IsNotExist, AudiencesService],
  exports: [AudiencesService],
})
export class AudiencesModule {}
