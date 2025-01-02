import { ProfileSummary } from '@/src/entities/ProfileSummary.entity';
import { ProfileTypes } from '@/src/lib/enums';
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(private dbSource: DataSource) {
    //
    this.dbManager = this.dbSource.manager;
  }

  private dbManager: EntityManager;

  async createProfile(
    profileData: {
      userId: string;
      profileTypeId: string;
      profileType: ProfileTypes;
      isAdmin?: boolean;
    },
    options?: { transactionManager?: EntityManager },
  ) {
    const dbManager = options.transactionManager || this.dbManager;
    let profile = dbManager.create(ProfileSummary, profileData);

    profile = await dbManager.save(profile);
    return profile;
  }

  async getProfileSummary(
    userId: string,
    options?: {
      profileType: ProfileTypes;
      profileTypeId: string;
    },
  ): Promise<ProfileSummary | undefined> {
    const profileSummaries = await this.dbManager.find(ProfileSummary, {
      where: {
        userId,
      },
    });

    let profileSumary: ProfileSummary = undefined;
    if (profileSummaries.length > 0) {
      profileSumary =
        profileSummaries.find((profile) => {
          options?.profileType && options?.profileTypeId
            ? profile.profileType === options.profileType &&
              profile.profileTypeId === options.profileTypeId
            : profile.isAdmin === true;
        }) ||
        // if none is found return the first
        profileSummaries[0];
    }

    return profileSumary;
  }
}
