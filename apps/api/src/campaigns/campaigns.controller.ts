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
import { CampaignsService } from './campaigns.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateCampaignDto } from './dto/create-campaigns.dto';
import { Campaign } from './entities/campaigns.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { UpdateCampaignsDto } from './dto/update-campaigns.dto';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { CampaignTransaction } from './entities/campaign-transactions.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Campaigns')
@Controller({
  path: 'campaigns',
  version: '1',
})
export class CampaignsController {
  constructor(private readonly audiencesService: CampaignsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() dto: CreateCampaignDto,
    @AuthUser() user: User,
  ): Promise<Campaign> {
    return this.audiencesService.create(dto, user);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: number,
    @Body() dto: UpdateCampaignsDto,
  ): Promise<Campaign> {
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @AuthUser() user: User,
  ): Promise<InfinityPaginationResultType<Campaign>> {
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
  findOne(@Param('id') id: string): Promise<Campaign> {
    return this.audiencesService.findOne({ id: +id });
  }

  @Get(':id/transactions')
  @HttpCode(HttpStatus.OK)
  findTransactions(@Param('id') id: string): Promise<CampaignTransaction[]> {
    return this.audiencesService.findTransactions(Number(id));
  }
}
