import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateNFTDto {
  @ApiProperty({ example: 'My awesome NFT' })
  @MaxLength(32)
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'CNFT is awesome' })
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @MaxLength(10)
  @IsOptional()
  @ApiProperty({ example: 'CNFT' })
  symbol?: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 'My awesome NFT' })
  @IsOptional()
  metadataUri?: string;

  @IsOptional()
  attributes?: Array<{ trait_type: string; value: string }>;

  @IsOptional()
  @ApiProperty({ example: '0x00' })
  creator?: string;

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

  @IsOptional()
  @ApiProperty({ example: '' })
  collectionImage?: string;

  @IsOptional()
  @ApiProperty({ example: '' })
  collectionMetadataUri?: string;
}
