import { ApiProperty } from '@nestjs/swagger';

export class StatDto {
  @ApiProperty({ example: 1 })
  totalDrop: number;

  @ApiProperty({ example: 1 })
  totalAirdropedNft: number;

  @ApiProperty({ example: 1 })
  totalWallets: number;
}
