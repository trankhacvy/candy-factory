import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { User } from 'src/users/entities/user.entity';
import { Drop } from 'src/drops/entities/drop.entity';

export enum TransactionStatus {
  IDLE = 1,
  PROCESSING = 2,
  SUCCESS = 3,
  FAILED = 4,
}

@Entity()
export class Transaction extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  signature: string;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({ type: String })
  sender: string;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.IDLE,
  })
  status: TransactionStatus;

  @ManyToOne(() => User, (user) => user.nfts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @OneToMany(() => Drop, (drop) => drop.transaction)
  drops?: Drop[];

  @Column({ type: 'int8', name: 'user_id' })
  userId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
