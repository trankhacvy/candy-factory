import { Module, forwardRef } from '@nestjs/common';
import { AudienceGroupsService } from './audience-groups.service';
import { AudienceGroupsController } from './audience-groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudienceGroup } from './entities/audience-group.entity';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { AudiencesModule } from 'src/audiences/audiences.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AudienceGroup]),
    forwardRef(() => AudiencesModule),
  ],
  controllers: [AudienceGroupsController],
  providers: [IsExist, IsNotExist, AudienceGroupsService],
  exports: [AudienceGroupsService],
})
export class AudienceGroupsModule {}
