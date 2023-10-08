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
import { User } from 'src/users/entities/user.entity';
import { DropTransaction } from './drop-transaction.entity';

export enum DropStatus {
  PROCESSING = 1,
  FINISH = 2,
}

@Entity()
export class Drop extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String })
  name: string;

  @Column({
    type: 'enum',
    enum: DropStatus,
    default: DropStatus.PROCESSING,
  })
  status: DropStatus;

  @ManyToOne(() => NFT, (nft) => nft.drops, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'nft_id' })
  nft!: NFT;

  @Column({ type: 'int8', name: 'nft_id' })
  nftId!: number;

  @ManyToOne(() => AudienceGroup, (group) => group.drops, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group!: AudienceGroup;

  @Column({ type: 'int8', name: 'group_id' })
  groupId!: number;

  @OneToMany(() => DropTransaction, (entity) => entity.drop)
  transactions: DropTransaction[];

  @ManyToOne(() => User, (user) => user.drops, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int8', name: 'user_id' })
  userId!: number;

  @Column({ type: Number, nullable: true, default: 0, name: 'num_of_nft' })
  numOfNft: number;

  @Column({ type: Number, nullable: true, default: 0, name: 'minted_nft' })
  mintedNft: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
