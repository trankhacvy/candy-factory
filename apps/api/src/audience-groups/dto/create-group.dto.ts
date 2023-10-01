import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAudienceGroupDto {
  @ApiProperty({ example: 'Vip members' })
  @IsNotEmpty()
  name: string;
}
