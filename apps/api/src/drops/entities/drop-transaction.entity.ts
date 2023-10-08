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
import { Drop } from './drop.entity';

export enum DropTxStatus {
  PROCESSING = 1,
  SUCCESS = 2,
  FAILED = 3,
}

@Entity()
export class DropTransaction extends EntityHelper {
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
    enum: DropTxStatus,
    default: DropTxStatus.PROCESSING,
  })
  status: DropTxStatus;

  @ManyToOne(() => Drop, (drop) => drop.transactions)
  @JoinColumn({ name: 'drop_id' })
  drop: Drop;

  @Column({ type: 'int8', name: 'drop_id' })
  dropId!: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
