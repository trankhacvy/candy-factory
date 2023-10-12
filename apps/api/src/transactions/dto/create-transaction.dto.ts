import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TransactionStatus } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsNotEmpty()
  signature: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  sender: string;

  @IsOptional()
  status?: TransactionStatus;
}
