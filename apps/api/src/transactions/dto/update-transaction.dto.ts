import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsOptional()
  status?: TransactionStatus;
}
