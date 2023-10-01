import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateAudienceDto {
  @ApiProperty({ example: '0x00' })
  @IsOptional()
  wallet?: string;
}
