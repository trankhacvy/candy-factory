import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Audience } from 'src/audiences/entities/audience.entity';
import { Campaign } from 'src/campaigns/entities/campaigns.entity';

@Entity()
export class AudienceGroup extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String })
  name: string;

  @Column({ type: Number, nullable: true, default: 0 })
  numOfAudience: number;

  @Column({ type: Boolean, default: false, nullable: true })
  isFavorite: boolean;

  @OneToMany(() => Audience, (entity) => entity.group)
  members: Audience[];

  @OneToOne(() => Campaign, (campaign) => campaign.group, {
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
