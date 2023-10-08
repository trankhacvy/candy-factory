import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @IsEnum(Order)
  readonly order?: Order = Order.DESC;

  @Type(() => Number)
  @IsNumber()
  readonly page?: number = 1;

  @Type(() => Number)
  @IsNumber()
  readonly take?: number = 20;

  get skip(): number {
    return ((this.page ?? 1) - 1) * (this.take ?? 20);
  }

  @IsString()
  @IsOptional()
  readonly q?: string = '';
}
