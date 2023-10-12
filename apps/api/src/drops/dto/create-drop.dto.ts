import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Drop } from '../entities/drop.entity';

export class CreateDropDto {
  @ApiProperty({ example: 'New Action' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  nftId: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  transactionId: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  groupId?: number;

  @ApiProperty({ name: 'collection' })
  @IsOptional()
  collection?: string;
}

export class CreateDropTxDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  dropId: Drop['id'];

  @ApiProperty({ example: '0x00' })
  @IsNotEmpty()
  nftAddress: string;

  @ApiProperty({ example: '0x00' })
  @IsNotEmpty()
  signature: string;

  @ApiProperty({ example: '0x00' })
  @IsNotEmpty()
  wallet: string;
}
