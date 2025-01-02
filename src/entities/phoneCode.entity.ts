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
import { Country } from './country.entity';
import { ServiceProviderUser } from './serviceProviderUser.entity';
import { ServiceSubscriberUser } from './serviceSubscriberUser.entity';

@Entity()
export class PhoneCode {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: string;

  // foreign keys
  @Column({ type: 'bigint' })
  countryId: string;

  // relations
  @ManyToOne(() => Country, (country) => country.phoneCodes)
  @JoinColumn({ name: 'countryId' })
  country: Country;

  @OneToMany(
    () => ServiceSubscriberUser,
    (serviceSubscriberUser) => serviceSubscriberUser.phoneCode,
  )
  serviceSubscriberUsers: ServiceSubscriberUser[];

  @OneToMany(
    () => ServiceProviderUser,
    (serviceProviderUser) => serviceProviderUser.phoneCode,
  )
  serviceProviderUsers: ServiceProviderUser;
}
