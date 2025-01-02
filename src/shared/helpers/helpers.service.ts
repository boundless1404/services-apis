import { PhoneCode } from '@/src/entities/phoneCode.entity';
import { ServiceSubscriberUser } from '@/src/entities/serviceSubscriberUser.entity';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class HelpersService {
  constructor(private dbSource: DataSource) {
    //
    this.dbManager = this.dbSource.manager;
  }

  private dbManager: EntityManager;

  async getServiceSubscriberUser({
    email,
    serviceSubscriberUserId,
  }: {
    email?: string;
    serviceSubscriberUserId?: string;
  }): Promise<ServiceSubscriberUser> {
    const entityUserProfile = await this.dbManager.findOne(
      ServiceSubscriberUser,
      {
        where: {
          ...(email ? { email } : { id: serviceSubscriberUserId }),
        },
      },
    );

    return entityUserProfile;
  }

  getPhoneCodeById(phoneCodeId: string) {
    return this.dbManager.findOne(PhoneCode, {
      where: {
        id: phoneCodeId,
      },
    });
  }
}
