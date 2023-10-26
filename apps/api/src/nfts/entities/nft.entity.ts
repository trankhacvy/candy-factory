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
import { IsOptional, MaxLength } from 'class-validator';
import { Drop } from 'src/drops/entities/drop.entity';
import { User } from 'src/users/entities/user.entity';

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

  @Column({ type: Boolean, name: 'is_collection', default: false })
  isCollection: boolean;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  attributes?: Array<{ trait_type: string; value: string }>;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  creators?: Array<{ creator: string; share: number }>;

  @OneToMany(() => Drop, (drop) => drop.nft)
  drops?: Drop[];

  @ManyToOne(() => User, (user) => user.nfts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'int8', name: 'user_id' })
  userId!: number;

  @Column({ nullable: true, name: 'collection_id' })
  public collectionId?: number;

  @ManyToOne(() => NFT, (nft) => nft.id)
  @JoinColumn({ name: 'collection_id' })
  public collection?: NFT;

  @Column({ nullable: true, unique: true, name: 'nft_address' })
  public collectionAddress?: string;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'{}'",
    nullable: true,
  })
  public collectionKeys?: Record<string, string>;

  @Column({ type: Number, default: 0 })
  royalty: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
