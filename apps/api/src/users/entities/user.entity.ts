import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EntityHelper } from 'src/utils/entity-helper';
import { Expose } from 'class-transformer';
import { NFT } from 'src/nfts/entities/nft.entity';
import { AudienceGroup } from 'src/audience-groups/entities/audience-group.entity';
import { Drop } from 'src/drops/entities/drop.entity';

export enum UserStatus {
  ACTIVE = 1,
  INACTIVE = 2,
}

@Entity()
export class User extends EntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  // For "string | null" we need to use String type.
  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ type: String, unique: true, nullable: true })
  @Expose({ groups: ['me', 'admin'] })
  wallet: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  firstName: string | null;

  @Index()
  @Column({ type: String, nullable: true })
  lastName: string | null;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @OneToMany(() => NFT, (nft) => nft.user)
  nfts?: NFT[];

  @OneToMany(() => AudienceGroup, (group) => group.user)
  groups?: AudienceGroup[];

  @OneToMany(() => Drop, (drop) => drop.user)
  drops?: Drop[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
