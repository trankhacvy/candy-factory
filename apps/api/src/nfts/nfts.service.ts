import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsOrder, Raw, Repository } from 'typeorm';
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
import { MintNFTService } from 'src/shared/services/nft-mint-service';
import { CreateMetadataAccountArgsV3 } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class NFTsService {
  constructor(
    @InjectRepository(NFT)
    private nftsRepository: Repository<NFT>,
    private connectionService: ConnectionService,
    private storageService: StorageService,
    private mintNFTService: MintNFTService,
  ) {}

  async create(dto: CreateNFTDto, user: User) {
    if (dto.image.length === 0) throw new BadRequestException('Invalid image');

    let nftCollection: NFT;

    if (dto.collectionId) {
      nftCollection = await this.findOne({ id: dto.collectionId });
    } else {
      // create collection
      if (dto.collectionImage?.length === 0)
        throw new BadRequestException('Invalid collection image');

      const uploadCollectionImageResult = await this.storageService.upload(
        dto.collectionImage?.[0]!,
      );

      const metadata = {
        name: dto.collectionName ?? '',
        symbol: dto.collectionSymbol ?? '',
        description: dto.collectionDescription ?? '',
        seller_fee_basis_points: dto.royalty ?? 0,
        external_url: dto.collectionExternalUrl,
        image: uploadCollectionImageResult.url,
        attributes: [],
      };

      const uploadCollectionMetadataResult =
        await this.storageService.uploadMetadata(metadata);

      const payer = this.connectionService.feePayer;

      const collectionMetadata: CreateMetadataAccountArgsV3 = {
        data: {
          name: metadata.name,
          symbol: metadata.symbol,
          uri: uploadCollectionMetadataResult.url,
          sellerFeeBasisPoints: metadata.seller_fee_basis_points,
          creators: [
            {
              address: payer.publicKey,
              verified: false,
              share: (dto.creators ?? []).length === 0 ? 100 : 0,
            },
            ...(dto.creators ?? []).map((item) => ({
              address: new PublicKey(item.address ?? ''),
              verified: false,
              share: Number(item.share),
            })),
          ],
          collection: null,
          uses: null,
        },
        isMutable: false,
        collectionDetails: null,
      };

      console.log('collectionMetadata', collectionMetadata);

      const { mint, tokenAccount, masterEditionAccount, metadataAccount } =
        await this.mintNFTService.mintCollection(collectionMetadata);

      nftCollection = await this.nftsRepository.save(
        this.nftsRepository.create({
          name: metadata.name,
          description: metadata.description,
          symbol: metadata.symbol,
          userId: user.id,
          image: uploadCollectionImageResult.url,
          metadataUri: uploadCollectionMetadataResult.url,
          externalUrl: metadata.external_url,
          isCollection: true,
          creators: dto.creators,
          collectionAddress: mint.toBase58(),
          collectionKeys: {
            tokenAccount: tokenAccount.toBase58(),
            masterEditionAccount: masterEditionAccount.toBase58(),
            metadataAccount: metadataAccount.toBase58(),
          },
        }),
      );
    }

    const image = dto.image[0];
    const uploadImageResult = await this.storageService.upload(image);

    console.log('uploadImageResult', uploadImageResult);

    const metadata = {
      name: dto.name ?? '',
      symbol: dto.symbol ?? '',
      description: dto.description ?? '',
      seller_fee_basis_points: dto.royalty ?? 0,
      external_url: dto.externalUrl ?? '',
      image: uploadImageResult.url,
      attributes: dto.attributes ?? [],
    };

    const uploadMetadataResult =
      await this.storageService.uploadMetadata(metadata);

    console.log('uploadMetadataResult', uploadMetadataResult);

    return this.nftsRepository.save(
      this.nftsRepository.create({
        name: metadata.name,
        description: metadata.description,
        symbol: metadata.symbol,
        userId: user.id,
        image: uploadImageResult.url,
        metadataUri: uploadMetadataResult.url,
        externalUrl: metadata.external_url,
        isCollection: false,
        creators: dto.creators,
        attributes: metadata.attributes,
        collectionId: nftCollection.id,
      }),
    );
  }

  async createRaw(nft: Partial<NFT>) {
    return this.nftsRepository.save(
      this.nftsRepository.create(nft),
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
          isCollection: false,
          ...where,
        },
        {
          description: Raw(
            (alias) => `LOWER(${alias}) LIKE LOWER(:description)`,
            {
              description: `%${dto.q}%`,
            },
          ),
          isCollection: false,
          ...where,
        },
      ],
      relations: ['collection'],
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
