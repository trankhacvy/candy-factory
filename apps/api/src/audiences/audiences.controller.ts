import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AudiencesService } from './audiences.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateAudienceDto } from './dto/create-audience.dto';
import { Audience } from './entities/audience.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { UpdateAudienceDto } from './dto/update-audience.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Audiences')
@Controller({
  path: 'audiences',
  version: '1',
})
export class AudiencesController {
  constructor(private readonly audiencesService: AudiencesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateAudienceDto): Promise<Audience> {
    return this.audiencesService.create(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateAudienceDto,
  ): Promise<Audience> {
    return this.audiencesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: number): Promise<any> {
    await this.audiencesService.softDelete(id);
    return {};
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InfinityPaginationResultType<Audience>> {
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.audiencesService.findManyWithPagination({
        page,
        limit,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<NullableType<Audience>> {
    return this.audiencesService.findOne({ id: +id });
  }
}
