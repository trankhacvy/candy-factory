import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Campaign } from '../entities/campaigns.entity';

export class CreateCampaignDto {
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

export class CreateCampaignTxDto {
  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  campaignId: Campaign['id'];

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
