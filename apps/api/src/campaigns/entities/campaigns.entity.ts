import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { NFT } from 'src/nfts/entities/nft.entity';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';
import { CampaignTransaction } from './campaign-transactions.entity';

@Entity()
export class Campaign extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @OneToOne(() => NFT, (nft) => nft.campaign, { eager: true })
  nft?: NFT;

  @OneToOne(() => AudienceGroup, (group) => group.campaign, { eager: true })
  group?: AudienceGroup;

  @OneToMany(() => CampaignTransaction, (entity) => entity.campaign)
  transactions: CampaignTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
