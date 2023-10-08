import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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
  groupId: number;
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
