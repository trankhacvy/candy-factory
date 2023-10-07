import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Audience } from 'src/audiences/entities/audience.entity';
import { Campaign } from 'src/campaigns/entities/campaigns.entity';
import { User } from 'src/users/entities/user.entity';

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

  @OneToOne(() => Campaign, (campaign) => campaign.group)
  campaign?: Campaign;

  @ManyToOne(() => User, (user) => user.groups, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int8', name: 'user_id' })
  userId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
