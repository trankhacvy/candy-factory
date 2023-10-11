import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DropsService } from './drops.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateDropDto } from './dto/create-drop.dto';
import { Drop } from './entities/drop.entity';
import { UpdateDropDto } from './dto/update-drop.dto';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageDto } from 'src/utils/dtos/page.dto';
import { TransactionsPageOptionsDto } from './dto/transaction-page-option.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('Drops')
@Controller({
  path: 'drops',
  version: '1',
})
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateDropDto, @AuthUser() user: User): Promise<Drop> {
    return this.dropsService.create(dto, user);
  }

  @Post('/get-price')
  getPrice(@Body() dto: CreateDropDto): Promise<number> {
    return this.dropsService.getDropPrice(dto);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateDropDto): Promise<Drop> {
    return this.dropsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.dropsService.softDelete(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: PageOptionsDto,
    @AuthUser() user: User,
  ): Promise<PageDto<Drop>> {
    return this.dropsService.findAll(dto, { userId: user.id });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<Drop> {
    return this.dropsService.findOne({ id: +id });
  }

  @Get(':id/transactions')
  @HttpCode(HttpStatus.OK)
  async findTransactions(
    @Param('id') dropId: string,
    @Query() dto: TransactionsPageOptionsDto,
  ) {
    return this.dropsService.findTransactionsManyWithPagination(dto, {
      dropId: Number(dropId),
      ...(dto.status ? { status: dto.status } : {}),
    });
  }
}
