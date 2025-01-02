import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProfileTypes } from '../lib/enums';

@Entity()
export class ProfileSummary {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'enum', enum: ProfileTypes, nullable: true })
  profileType: ProfileTypes;

  @Column({ type: 'bigint', nullable: false })
  profileTypeId: string;

  @Column({ type: 'bigint', nullable: false })
  userId: string;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
