import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';

export class CreateAudienceDto {
  @ApiProperty({ example: '0x00' })
  @IsNotEmpty()
  wallet: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  groupId: AudienceGroup['id'];
}
