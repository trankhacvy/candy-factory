import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

class CreateAudience {
  @ApiProperty({ example: '0x123' })
  @IsNotEmpty()
  wallet: string;
}

export class CreateAudienceGroupDto {
  @ApiProperty({ example: 'Vip members' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty({
    isArray: true,
    type: CreateAudience,
  })
  @IsArray()
  audiences: CreateAudience[];
}

export class CreateAudienceGroupWithCsvDto {
  @ApiProperty({ example: 'Vip members' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}
