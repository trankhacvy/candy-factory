import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { DropTxStatus } from '../entities/drop-transaction.entity';
import { Transform } from 'class-transformer';

export class TransactionsPageOptionsDto extends PageOptionsDto {
  @IsEnum(DropTxStatus)
  @Transform((params) => (params.value === '' ? null : Number(params.value)))
  @IsOptional()
  readonly status?: DropTxStatus;
}
