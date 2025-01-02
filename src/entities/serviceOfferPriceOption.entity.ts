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
import { PriceDurations } from '../lib/enums';
import { Currency } from './currency.entity';
import { ServiceOffer } from './serviceOffer.entity';


@Entity()
export default class ServiceOfferPriceOption {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'numeric', default: '0' })
  price: string;

  @Column({ type: 'varchar', default: '' })
  description: string;

  @Column({ type: 'enum', enum: PriceDurations })
  durationType: PriceDurations;

  @Column({ type: 'integer' })
  discount: string;

  /** This is the minimum number of days for which the discount is applicable. */
  @Column({ type: 'integer' })
  minimumDurationCountForDiscount: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  // foreign keys
  @Column({ type: 'bigint' })
  currencyId: string;

  @Column({ type: 'bigint' })
  serviceOfferId: string;

  // relations
  @ManyToOne(() => Currency, (currency) => currency.serviceOffers)
  @JoinColumn({ name: 'currencyId' })
  currency: Currency;

  @ManyToOne(
    () => ServiceOffer,
    (serviceOffer) => serviceOffer.serviceOfferPriceOptions,
  )
  @JoinColumn({ name: 'serviceOfferId' })
  serviceOffer: ServiceOffer;
}
