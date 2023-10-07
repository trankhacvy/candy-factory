import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { NFT } from 'src/nfts/entities/nft.entity';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';
import { CampaignTransaction } from './campaign-transactions.entity';
import { User } from 'src/users/entities/user.entity';

export enum CampaignStatus {
  PROCESSING = 1,
  FINISH = 2,
}

@Entity()
export class Campaign extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.PROCESSING,
  })
  status: CampaignStatus;

  @OneToOne(() => NFT, (nft) => nft.campaign, {
    eager: true,
  })
  @JoinColumn({ name: 'nft_id' })
  nft?: NFT;

  @OneToOne(() => AudienceGroup, (group) => group.campaign, {
    eager: true,
  })
  @JoinColumn({ name: 'group_id' })
  group?: AudienceGroup;

  @OneToMany(() => CampaignTransaction, (entity) => entity.campaign)
  transactions: CampaignTransaction[];

  @ManyToOne(() => User, (user) => user.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int8', name: 'user_id' })
  userId!: number;

  @Column({ type: Number, nullable: true, default: 0 })
  numOfNft: number;

  @Column({ type: Number, nullable: true, default: 0 })
  mintedNft: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
