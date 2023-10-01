import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MaxLength } from 'class-validator';

export class UpdateCampaignsDto {
  @ApiProperty({ example: 'My awesome Campaign' })
  @IsOptional()
  name?: string;
}
