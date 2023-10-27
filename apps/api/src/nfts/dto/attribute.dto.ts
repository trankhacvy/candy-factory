import {
  IsNotEmpty,
} from 'class-validator';

export class AttributeDto {
  @IsNotEmpty()
  traitType: string;

  @IsNotEmpty()
  value: string;
}
