import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AudienceGroupsService } from './audience-groups.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateAudienceGroupDto,
  CreateAudienceGroupWithCsvDto,
} from './dto/create-group.dto';
import { AudienceGroup } from './entities/audience-group.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { UpdateAudienceGroupDto } from './dto/update-group.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Audience } from 'src/audiences/entities/audience.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('AudienceGroups')
@Controller({
  path: 'audience-groups',
  version: '1',
})
export class AudienceGroupsController {
  constructor(private readonly audiencesService: AudienceGroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @AuthUser() user: User,
    @Body() dto: CreateAudienceGroupDto,
  ): Promise<AudienceGroup> {
    return this.audiencesService.create(dto, user);
  }

  @Post('/csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    description: 'upload',
    type: CreateAudienceGroupWithCsvDto,
  })
  @ApiOperation({ summary: 'Create group' })
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.CREATED)
  createWithCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: 'text/csv' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @AuthUser() user: User,
    @Body() dto: CreateAudienceGroupWithCsvDto,
  ): Promise<AudienceGroup> {
    return this.audiencesService.createWithCsv(dto, file, user);
  }

  @Post('/demo')
  @HttpCode(HttpStatus.CREATED)
  createDemo(
    @AuthUser() user: User,
    @Body() dto: CreateAudienceGroupDto,
  ): Promise<AudienceGroup> {
    return this.audiencesService.createDemo(dto, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAudienceGroupDto,
  ): Promise<AudienceGroup> {
    return this.audiencesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.audiencesService.softDelete(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @AuthUser() user: User,
  ): Promise<InfinityPaginationResultType<AudienceGroup>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.audiencesService.findManyWithPagination(
        {
          page,
          limit,
        },
        {
          userId: user.id,
        },
      ),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<AudienceGroup>> {
    return this.audiencesService.findOne({ id: +id });
  }

  @Get(':groupId/wallets')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @HttpCode(HttpStatus.OK)
  async findWallets(
    @Param('groupId') groupId: string,
    @Query() dto: PageOptionsDto,
  ) {
    return this.audiencesService.findAudiencesByGroupPagination(
      Number(groupId),
      dto,
    );
  }
}
