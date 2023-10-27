import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
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
  CreateAudienceGroupWithCollectionDto,
  CreateAudienceGroupWithCsvDto,
} from './dto/create-group.dto';
import { AudienceGroup } from './entities/audience-group.entity';
import { UpdateAudienceGroupDto } from './dto/update-group.dto';
import { NullableType } from 'src/utils/types/nullable.type';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageDto } from 'src/utils/dtos/page.dto';

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

  @Post('/collection')
  @ApiOperation({ summary: 'Create group' })
  @HttpCode(HttpStatus.CREATED)
  createWithCollection(
    @AuthUser() user: User,
    @Body() dto: CreateAudienceGroupWithCollectionDto,
  ): Promise<AudienceGroup> {
    return this.audiencesService.createWithCollection(dto, user);
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
  async findAll(
    @Query() dto: PageOptionsDto,
    @AuthUser() user: User,
  ): Promise<PageDto<AudienceGroup>> {
    return this.audiencesService.findManyWithPagination(dto, {
      userId: user.id,
    });
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
