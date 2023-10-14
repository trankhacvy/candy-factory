import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindOptionsOrder,
  Raw,
  Repository,
} from 'typeorm';
import { NFT } from './entities/nft.entity';
import { CreateNFTDto } from './dto/create-nft.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { StorageService } from 'src/shared/services/storage-service';
import { ConnectionService } from 'src/shared/services/connection-service';
import { User } from 'src/users/entities/user.entity';
import { initNFT } from 'src/utils/wallet';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { PageMetaDto } from 'src/utils/dtos/page-meta.dto';
import { PageDto } from 'src/utils/dtos/page.dto';

@Injectable()
export class NFTsService {
  constructor(
    @InjectRepository(NFT)
    private nftsRepository: Repository<NFT>,
    private connectionService: ConnectionService,
    private storageService: StorageService,
  ) {}

  async create(dto: CreateNFTDto) {
    if (dto.collectionImage.length === 0)
      throw new InternalServerErrorException('Invalid collection image');

    if (dto.image.length === 0)
      throw new InternalServerErrorException('Invalid image');

    const collectionImage = dto.collectionImage[0];
    const image = dto.image[0];

    const [uploadImageResult, uploadCollectionImageResult] = await Promise.all([
      this.storageService.upload(collectionImage),
      this.storageService.upload(image),
    ]);

    console.log('uploadImageResult', uploadImageResult);
    console.log('uploadCollectionImageResult', uploadCollectionImageResult);

    const collectionMetadata = {
      name: dto.collectionName,
      symbol: dto.collectionSymbol,
      description: dto.collectionDescription,
      seller_fee_basis_points: 0,
      external_url: dto.collectionExternalUrl ?? '',
      image: uploadCollectionImageResult.url,
      attributes: [],
    };

    const metadata = {
      name: dto.name,
      symbol: dto.symbol,
      description: dto.description,
      seller_fee_basis_points: 0,
      external_url: dto.externalUrl ?? '',
      image: uploadImageResult.url,
      attributes: dto.attributes ?? [],
    };

    const [uploadCollectionMetadataResult, uploadNftMetadataResult] =
      await Promise.all([
        this.storageService.uploadMetadata(collectionMetadata),
        this.storageService.uploadMetadata(metadata),
      ]);

    console.log(
      'uploadCollectionMetadataResult',
      uploadCollectionMetadataResult,
    );
    console.log('uploadNftMetadataResult', uploadNftMetadataResult);

    console.log('insert: ', {
      ...dto,
      image: uploadImageResult.url,
      metadataUri: uploadNftMetadataResult.url,
      collectionImage: uploadCollectionImageResult.url,
      collectionMetadataUri: uploadCollectionMetadataResult.url,
    });

    return this.nftsRepository.save(
      this.nftsRepository.create({
        ...dto,
        image: uploadImageResult.url,
        metadataUri: uploadNftMetadataResult.url,
        collectionImage: uploadCollectionImageResult.url,
        collectionMetadataUri: uploadCollectionMetadataResult.url,
      }),
    );
  }

  async initUserNFT(user: User) {
    return this.nftsRepository.save(
      this.nftsRepository.create({
        ...initNFT,
        userId: user.id,
      }),
    );
  }

  async update(id: NFT['id'], payload: DeepPartial<NFT>): Promise<NFT> {
    await this.findOne({ id });

    return this.nftsRepository.save(
      this.nftsRepository.create({
        id,
        ...payload,
      }),
    );
  }

  async softDelete(id: NFT['id']): Promise<void> {
    await this.findOne({ id });

    await this.nftsRepository.softDelete(id);
  }

  async findManyWithPagination(
    dto: PageOptionsDto,
    where?: EntityCondition<NFT>,
    order: FindOptionsOrder<NFT> = { createdAt: dto.order },
  ): Promise<PageDto<NFT>> {
    const [result, total] = await this.nftsRepository.findAndCount({
      where: [
        {
          name: Raw((alias) => `LOWER(${alias}) LIKE LOWER(:name)`, {
            name: `%${dto.q}%`,
          }),
          ...where,
        },
        {
          description: Raw(
            (alias) => `LOWER(${alias}) LIKE LOWER(:description)`,
            {
              description: `%${dto.q}%`,
            },
          ),
          ...where,
        },
      ],
      order,
      take: dto.take,
      skip: dto.skip,
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto: dto,
    });

    return new PageDto(result, pageMetaDto);
  }

  async findOne(fields: EntityCondition<NFT>): Promise<NFT> {
    const nft = await this.nftsRepository.findOne({
      where: fields,
    });

    if (!nft) {
      throw new NotFoundException('Nft not found');
    }

    return nft;
  }
}
