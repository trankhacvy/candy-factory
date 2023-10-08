import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateDropDto {
  @ApiProperty({ example: 'My awesome drop' })
  @IsOptional()
  name?: string;
}
