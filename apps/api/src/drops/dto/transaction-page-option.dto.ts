import { IsNotEmpty, IsString } from 'class-validator';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';

export class TransactionsPageOptionsDto extends PageOptionsDto {
  @IsString()
  @IsNotEmpty()
  readonly dropId: string;
}
