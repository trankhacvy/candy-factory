import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';

@Entity()
export class Audience extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: String })
  wallet: string;

  @ManyToOne(() => AudienceGroup, (group) => group.members)
  @JoinColumn({ name: 'group_id' })
  group: AudienceGroup;

  @Column({ type: 'int8', name: 'group_id' })
  groupId: AudienceGroup['id'];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
