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
import { Service } from './service.entity';
import { FileMimeType } from '../lib/enums';
import { ServiceOffer } from './serviceOffer.entity';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  forEntity: string;

  @Column({ type: 'varchar', nullable: true })
  forEntityId: string;

  @Column()
  filename: string;

  @Column({ type: 'enum', enum: FileMimeType })
  mimetype: FileMimeType;

  @Column({ type: 'numeric' })
  size: number;

  @Column()
  url: string;

  @Column()
  key: string;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  filePurpose: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Index()
  @Column({ type: 'varchar', nullable: true })
  fileServerStatus: string | null;

  @Index()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Index()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Index()
  @DeleteDateColumn()
  deletedAt: Date;

  // foreign keys
  @Column({ type: 'varchar', nullable: true })
  serviceId: string;

  // relations
  @ManyToOne(() => Service, (service) => service.files, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @ManyToOne(() => ServiceOffer, (serviceOffer) => serviceOffer.files, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceOfferId' })
  serviceOffer: ServiceOffer;
}
