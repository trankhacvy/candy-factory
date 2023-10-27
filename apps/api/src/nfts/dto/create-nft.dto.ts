import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { AttributeDto } from './attribute.dto';
import { CreatorDto } from './creator.dto';

export class CreateNFTDto {
  @ApiProperty({ example: 'My awesome NFT' })
  @IsNotEmpty()
  @MaxLength(32)
  name: string;

  @ApiProperty({ example: 'CNFT is awesome' })
  @MaxLength(200)
  description: string;

  @MaxLength(10)
  @IsNotEmpty()
  @ApiProperty({ example: 'CNFT' })
  symbol: string;

  @ApiProperty({
    name: 'image',
    description: 'Image that you would want to turn into nft',
    type: String,
    format: 'binary',
  })
  image: Express.Multer.File[];

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  attributes: AttributeDto[];

  @IsOptional()
  @Transform(({ value }) => JSON.parse(value), { toClassOnly: true })
  creators: CreatorDto[];

  @IsOptional()
  @ApiProperty({ example: 'http://google.com' })
  externalUrl?: string;

  @ValidateIf((o) => !o.collectionId)
  @IsNotEmpty()
  @MaxLength(32)
  @ApiProperty({ example: 'My awesome collection' })
  collectionName?: string;

  @MaxLength(200)
  @IsOptional()
  @ApiProperty({ example: 'My Collection' })
  collectionDescription?: string;

  @ValidateIf((o) => !o.collectionId)
  @MaxLength(10)
  @IsNotEmpty()
  @ApiProperty({ example: 'CNFT' })
  collectionSymbol?: string;

  @ValidateIf((o) => !o.collectionId)
  @ApiProperty({
    name: 'collectionImage',
    description: 'Image that you would want to turn into collection',
    type: String,
    format: 'binary',
    nullable: true,
  })
  collectionImage?: Express.Multer.File[];

  @IsOptional()
  @ApiProperty({ example: 'http://google.com', nullable: true })
  collectionExternalUrl?: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  collectionId?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  royalty?: number;
}
