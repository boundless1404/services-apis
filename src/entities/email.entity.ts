import { MailDataRequired } from '@sendgrid/mail';
import { EmailPriority } from '../lib/enums';
import { ContentTypes } from '../lib/types';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    unsigned: true,
  })
  id: string;

  @Column({ type: 'enum', enum: EmailPriority, default: EmailPriority.REGULAR })
  priority?: EmailPriority = EmailPriority.REGULAR;

  @Column({ type: 'jsonb', nullable: true })
  attachmentFileUrls: {
    fileType: ContentTypes;
    fileName: string;
    url: string;
  }[];

  @Column({ type: 'json' })
  body: MailDataRequired;

  @Column({ type: 'timestamptz', nullable: true })
  sendAt?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date;
}
