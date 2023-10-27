import { IsNotEmpty } from 'class-validator';

export class CreatorDto {
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  share: number;
}
