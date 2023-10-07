import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Campaign } from './campaigns.entity';

export enum CampaignTxStatus {
  PROCESSING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

@Entity()
export class CampaignTransaction extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, nullable: true })
  nftAddress?: string;

  @Column({ type: String, nullable: true })
  signature?: string;

  @Column({ type: String })
  wallet: string;

  @Column({
    type: 'enum',
    enum: CampaignTxStatus,
    default: CampaignTxStatus.PROCESSING,
  })
  status: CampaignTxStatus;

  @ManyToOne(() => Campaign, (campaign) => campaign.transactions)
  @JoinColumn({ name: 'campaign_id' })
  campaign: Campaign;

  @Column({ type: 'int8', name: 'campaign_id' })
  campaignId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
