import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// import { ServiceProvider } from './serviceProvider.entity';
import { PhoneCode } from './phoneCode.entity';

@Entity()
export class ServiceProviderUser {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'bigint', nullable: true })
  phoneCodeId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // foreign keys
  @Column({ type: 'bigint' })
  serviceProviderId: string;

  @ManyToOne(() => PhoneCode, (phoneCode) => phoneCode.serviceProviderUsers)
  @JoinColumn({ name: 'phoneCodeId' })
  phoneCode: PhoneCode;
}
