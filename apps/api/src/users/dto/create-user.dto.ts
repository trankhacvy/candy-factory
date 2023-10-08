import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Validate,
} from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
// import { FileEntity } from 'src/files/entities/file.entity';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';
import { IsPublicKey } from 'src/utils/validators/is-public-key';

export class CreateUserDto {
  @ApiProperty({ example: '63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'Wallet already exists',
  })
  @IsPublicKey()
  wallet: string | null;
}
