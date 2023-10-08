import { IsNotEmpty } from 'class-validator';
import { IsPublicKey } from 'src/utils/validators/is-public-key';

export class CreateAudienceWithoutGroupDto {
  @IsNotEmpty()
  @IsPublicKey()
  wallet: string;
}
