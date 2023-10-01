import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { IsOptional, MaxLength } from 'class-validator';
import { Campaign } from 'src/campaigns/entities/campaigns.entity';

@Entity()
export class NFT extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  @MaxLength(32)
  name: string;

  @Column({ type: String })
  @MaxLength(200)
  description: string;

  @Column({ type: String })
  @MaxLength(10)
  symbol: string;

  @Column({ type: String })
  image: string;

  @Column({ type: String })
  metadataUri: string;

  @Column({ type: String, nullable: true })
  externalUrl?: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  @IsOptional()
  attributes?: Array<{ trait_type: string; value: string }>;

  @Column({ type: String, nullable: true })
  @IsOptional()
  creator?: string;

  @Column({ type: String, nullable: true })
  @MaxLength(32)
  @IsOptional()
  collectionName?: string;

  @Column({ type: String, nullable: true })
  @MaxLength(200)
  @IsOptional()
  collectionDescription?: string;

  @Column({ type: String, nullable: true })
  @MaxLength(10)
  @IsOptional()
  collectionSymbol?: string;

  @Column({ type: String, nullable: true })
  @IsOptional()
  collectionImage?: string;

  @Column({ type: String, nullable: true })
  @IsOptional()
  collectionMetadataUri?: string;

  @Column({ type: String, nullable: true })
  collectionExternalUrl?: string;

  @OneToOne(() => Campaign, (campaign) => campaign.nft, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'campaign_id' })
  campaign?: Campaign;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
