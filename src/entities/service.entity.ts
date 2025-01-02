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
import { HospitalityServiceType } from '../lib/enums';
import { File } from './file.entity';
import { ServiceOffer } from './serviceOffer.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: HospitalityServiceType, nullable: false })
  type: HospitalityServiceType;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  /**
   * This is the service provider that owns this service.
   * This is so to allow a custom service to be created by a service providers
   */
  // foreign keys

  // relations
  @OneToMany(() => ServiceOffer, (serviceOffer) => serviceOffer.service)
  serviceOffers: ServiceOffer[];
  
  @OneToMany(() => File, (file) => file.service)
  files: File[];
}
