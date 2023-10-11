import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateAudienceWithoutGroupDto } from './create-audience-without-group.dto';

export class CreateAudienceGroupDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  isFavorite?: boolean;

  @IsArray()
  audiences: CreateAudienceWithoutGroupDto[];
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

export class CreateAudienceGroupWithCollectionDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  isFavorite?: boolean;

  @IsNotEmpty()
  collection: string;
}
