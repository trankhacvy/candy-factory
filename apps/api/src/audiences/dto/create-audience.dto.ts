import { IsNotEmpty } from 'class-validator';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';

export class CreateAudienceDto {
  @IsNotEmpty()
  wallet: string;

  @IsNotEmpty()
  groupId: AudienceGroup['id'];
}
