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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NFTsService } from './nfts.service';
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateNFTDto } from './dto/create-nft.dto';
import { NFT } from './entities/nft.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { UpdateNFTDto } from './dto/update-nft.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { TransformInterceptor } from 'src/utils/interceptors/response-transform.interceptor';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageDto } from 'src/utils/dtos/page.dto';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('NFTs')
@Controller({
  path: 'nfts',
  version: '1',
})
export class NFTsController {
  constructor(private readonly nftService: NFTsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 1 },
      { name: 'collectionImage', maxCount: 1 },
    ]),
  )
  @HttpCode(HttpStatus.CREATED)
  create(
    @AuthUser() user: User,
    @Body() dto: CreateNFTDto,
    @UploadedFiles()
    files: {
      image: Express.Multer.File[];
      collectionImage?: Express.Multer.File[];
    },
  ): Promise<NFT> {
    return this.nftService.create({
      ...dto,
      ...files,
      userId: user.id,
    });
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: number, @Body() dto: UpdateNFTDto): Promise<NFT> {
    return this.nftService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: number): Promise<void> {
    return this.nftService.softDelete(id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() dto: PageOptionsDto,
    @AuthUser() user: User,
  ): Promise<PageDto<NFT>> {
    return this.nftService.findManyWithPagination(dto, { userId: user.id });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TransformInterceptor)
  findOne(@Param('id') id: string): Promise<NFT> {
    return this.nftService.findOne({ id: +id });
  }
}
