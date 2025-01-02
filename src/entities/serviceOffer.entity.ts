import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { Service } from './service.entity';
import ServiceOfferPriceOption from './serviceOfferPriceOption.entity';
import { File } from './file.entity';

@Entity()
export class ServiceOffer {
  @PrimaryGeneratedColumn()
  id: string;

  @Index()
  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()', unique: true })
  publicId: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  type: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // foreign keys
  @Column({ type: 'bigint' })
  serviceId: string;

  // relations
  @ManyToOne(() => Service, (service) => service.serviceOffers)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @OneToMany(
    () => ServiceOfferPriceOption,
    (serviceOffer) => serviceOffer.serviceOffer,
  )
  serviceOfferPriceOptions: ServiceOfferPriceOption[];

  @OneToMany(() => File, (file) => file.serviceOffer)
  files: File[];
}
