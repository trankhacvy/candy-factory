import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, MaxLength } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateNFTDto {
  @ApiProperty({ example: 'My awesome NFT' })
  @MaxLength(32)
  name: string;

  @ApiProperty({ example: 'CNFT is awesome' })
  @MaxLength(200)
  description: string;

  @MaxLength(10)
  @ApiProperty({ example: 'CNFT' })
  symbol: string;

  @ApiProperty({
    name: 'image',
    description: 'Image that you would want to turn into nft',
    type: String,
    format: 'binary',
  })
  image: Express.Multer.File[];

  @ApiProperty({
    title: 'attributes',
    type: String,
    description: 'Attributes associated to this NFT',
    example: [{ trait_type: 'edification', value: '100' }],
  })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  attributes: {
    trait_type: string;
    value: string;
  }[];

  @IsOptional()
  @ApiProperty({ example: '0x00' })
  creator?: string;

  @IsOptional()
  @ApiProperty({ example: 'http://google.com' })
  externalUrl?: string;

  @MaxLength(32)
  @IsOptional()
  @ApiProperty({ example: 'My awesome collection' })
  collectionName?: string;

  @MaxLength(200)
  @IsOptional()
  @ApiProperty({ example: 'My Collection' })
  collectionDescription?: string;

  @MaxLength(10)
  @IsOptional()
  @ApiProperty({ example: 'CNFT' })
  collectionSymbol?: string;

  @ApiProperty({
    name: 'collectionImage',
    description: 'Image that you would want to turn into collection',
    type: String,
    format: 'binary',
  })
  collectionImage: Express.Multer.File[];

  @IsOptional()
  @ApiProperty({ example: 'http://google.com', nullable: true })
  collectionExternalUrl?: string;

  userId: User['id'];
}
