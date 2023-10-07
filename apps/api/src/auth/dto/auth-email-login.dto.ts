import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsPublicKey } from 'src/utils/validators/is-public-key';

export class AuthEmailLoginDto {
  @ApiProperty({ example: '63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs' })
  @IsPublicKey()
  @IsNotEmpty()
  wallet: string;
}
