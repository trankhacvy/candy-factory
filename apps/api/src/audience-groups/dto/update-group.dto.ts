import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAudienceGroupDto {
  @ApiProperty({ example: 'Vip members' })
  @IsOptional()
  name?: string;

  @ApiProperty({ example: true })
  @IsOptional()
  isFavorite?: boolean;
}
