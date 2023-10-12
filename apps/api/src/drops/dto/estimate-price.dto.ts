import { IsOptional } from 'class-validator';

export class EstimatePriceDto {
  @IsOptional()
  groupId?: number;
  @IsOptional()
  collection?: string;
}
