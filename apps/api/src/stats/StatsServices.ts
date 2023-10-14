import { Injectable } from '@nestjs/common';
import { StatDto } from './dto/stat.dto';
import { User } from 'src/users/entities/user.entity';
import { DropsService } from 'src/drops/drops.service';
import { PageOptionsDto } from 'src/utils/dtos/page-options.dto';
import { AudiencesService } from 'src/audiences/audiences.service';

@Injectable()
export class StatService {
  constructor(
    private dropsService: DropsService,
    private audiencesService: AudiencesService,
  ) {}

  async getStat(user: User): Promise<StatDto> {
    const drops = await this.dropsService.findAll(new PageOptionsDto(), {
      userId: user.id,
    });

    const totalWallets = await this.audiencesService.getTotalWallet(user);

    const totalAirdropedNft =
      await this.dropsService.getTotalAirdropedNFT(user);

    const dto = new StatDto();

    dto.totalDrop = drops.meta.itemCount;
    dto.totalAirdropedNft = totalAirdropedNft;
    dto.totalWallets = totalWallets;

    return dto;
  }
}
