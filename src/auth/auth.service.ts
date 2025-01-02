import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import {
  ResendTokenDto,
  ServiceProviderUserSignupDto,
  SignInDto,
  VerificationDto,
} from './dto/dto';
import { HelpersService } from '../shared/helpers/helpers.service';
import {
  throwBadRequest,
  throwForbidden,
  throwUnathorized,
} from '../utils/helpers';
import { RequestService } from '../shared/request/request.service';
import {
  AuthTokenPayload,
  AuthenticatedUserData,
  ProfileSummaryTokenData,
} from '../lib/types';
import { omit } from 'lodash';
import { SharedService } from '../shared/shared.service';
import { ProfileService } from '../shared/profile/profile.service';
import { ProfileTypes } from '../lib/enums';
import { ServiceSubscriberUser } from '../entities/serviceSubscriberUser.entity';
import { PhoneCode } from '../entities/phoneCode.entity';
import { ProfileSummary } from '../entities/ProfileSummary.entity';
import { ServiceProviderUser } from '../entities/serviceProviderUser.entity';

@Injectable()
export class AuthService {
  constructor(
    private dbSource: DataSource,
    private helperService: HelpersService,
    private requestService: RequestService,
    private sharedService: SharedService,
    private profileService: ProfileService,
  ) {
    //
    this.dbManager = this.dbSource.manager;
  }

  private dbManager: EntityManager;

  // get phone codes
  async getPhoneCodes() {
    return this.dbManager.find(PhoneCode);
  }

  async authenticateUserOnAuthServer(
    action: 'signin' | 'signup' | 'complete-verification' | 'resend-token',
    {
      signupDto,
      signinDto,
      verificationDto,
      resendTokenDto,
    }: {
      signupDto?: ServiceProviderUserSignupDto & Record<string, any>;
      signinDto?: SignInDto;
      verificationDto?: VerificationDto;
      resendTokenDto?: ResendTokenDto;
    },
  ) {
    const authServerRequestBody: {
      firstName: string;
      middleName?: string;
      lastName: string;
      email: string;
      password: string;
      initiateVerificationRequest: boolean;
    } = {
      ...signupDto,
      // turn request verification request on
      initiateVerificationRequest: true,
    };

    const authServerRequestPath = `/project/app/${action}`;

    const response = await this.requestService.sendRequest(
      authServerRequestPath,
      {
        body:
          action === 'signup'
            ? authServerRequestBody
            : ((signinDto ||
                verificationDto ||
                resendTokenDto) as unknown as Record<string, unknown>),
        method: 'POST',
      },
    );

    let userData:
      | undefined
      | (AuthenticatedUserData & { isVerified: boolean } & {
          phoneCode: { name: string };
        });
    if ([200, 201].includes(response.status)) {
      userData = response.data as AuthenticatedUserData & {
        isVerified: boolean;
      } & {
        phoneCode: { name: string };
      };
    } else {
      const actionError = {
        signup: throwForbidden('User data is invalid'),
        signin: throwUnathorized('Invalid credentials.'),
        'complete-verification': throwBadRequest('Verification failed.'),
        'resend-token': throwForbidden('invalid user token'),
      };

      return actionError[action];
    }

    return userData;
  }
  async resendToken(resendTokenDto: ResendTokenDto): Promise<any> {
    try {
      const userData = await this.authenticateUserOnAuthServer('resend-token', {
        resendTokenDto,
      });
      return userData;
    } catch (error) {
      throw new HttpException(
        'Could not resend token.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async signupSubscriber(signupDto: ServiceProviderUserSignupDto) {
    // do necessary checks
    // check if user already exists
    const entityUserProfile = await this.helperService.getServiceSubscriberUser(
      {
        email: signupDto.email,
      },
    );

    if (entityUserProfile) {
      throwForbidden('User already exists.');
    }

    let phoneCodeName = '';
    // let phoneCodeId = '';
    if (signupDto.phone && signupDto.phoneCodeId) {
      const phoneCode = await this.helperService.getPhoneCodeById(
        signupDto.phoneCodeId,
      );

      if (!phoneCode) {
        throwBadRequest('Invalid phone code.');
      }

      phoneCodeName = phoneCode.name;
      // phoneCodeId = phoneCode.id;
    }

    try {
      await this.authenticateUserOnAuthServer('signup', {
        signupDto: {
          ...signupDto,
          phoneCode: phoneCodeName,
        },
      });
    } catch (e) {
      if (e.response && e.response.status === 400) {
        const errorMessage = e.response.data?.message || 'Bad request';
        throwBadRequest(errorMessage);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        'An error occurred during signup process.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getAuthToken({
    authUserData,
    profileSummary,
  }: {
    authUserData: AuthenticatedUserData;
    profileSummary: ProfileSummary;
  }) {
    const authTokenPayload = {
      userData: {
        id: authUserData.id,
        firstName: authUserData.firstName,
        lastName: authUserData.lastName,
        email: authUserData.email,
        phone: authUserData.phone,
        phoneCode: authUserData.phoneCode,
      },
      profile: {
        profileType: profileSummary.profileType,
        profileTypeId: profileSummary.profileTypeId,
        id: profileSummary.id,
      },
      services: {
        name: '',
      },
    };

    const authToken = this.sharedService.signPayload(authTokenPayload);
    return authToken;
  }

  async getSubscriberUserData({ userId }: { userId: string }) {
    const userData = await this.getUserData({
      userId,
      profileType: ProfileTypes.SERVICE_SUBSCRIBER_USER,
      dbManager: this.dbManager,
    });

    return omit(userData, ['createdAt', 'updatedAt', 'deletedAt']);
  }

  async getUserData({
    userId,
    profileType,
    dbManager,
  }: {
    userId: string;
    profileType: ProfileTypes;
    dbManager: EntityManager;
  }) {
    const profileSummary = await dbManager.findOne(ProfileSummary, {
      where: {
        userId,
        profileType,
      },
    });

    return (await dbManager.findOne(
      profileType === ProfileTypes.SERVICE_SUBSCRIBER_USER
        ? ServiceSubscriberUser
        : ServiceProviderUser,
      {
        where: {
          id: profileSummary.id,
        },
      },
    )) as ServiceSubscriberUser | ServiceProviderUser;
  }

  async verifyToken(verificationDto: VerificationDto) {
    //
    const verifiedUserData = await this.authenticateUserOnAuthServer(
      'complete-verification',
      {
        verificationDto,
      },
    );

    if (!verifiedUserData || !verifiedUserData.id) {
      throw new HttpException(
        'Could not complete sign up process.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    // create profile
    const phoneCodeId = await this.dbManager.findOne(PhoneCode, {
      where: {
        name: verifiedUserData.phoneCode.name,
      },
    });
    let serviceSubscriberUser = this.dbManager.create(ServiceSubscriberUser, {
      email: verifiedUserData.email,
      firstName: verifiedUserData.firstName,
      lastName: verifiedUserData.lastName,
      phone: verifiedUserData.phone,
      // or branch should never happen
      phoneCodeId: phoneCodeId?.id || '',
    });

    let authTokenPayload: { token: string };
    await this.dbManager.transaction(async (transactionManager) => {
      serviceSubscriberUser = await this.dbManager.save(
        ServiceSubscriberUser,
        serviceSubscriberUser,
      );

      const profile = await this.profileService.createProfile(
        {
          userId: String(verifiedUserData.id),
          profileType: ProfileTypes.SERVICE_SUBSCRIBER_USER,
          profileTypeId: serviceSubscriberUser.id,
        },
        { transactionManager },
      );

      authTokenPayload = await this.generateAuthToken(
        verifiedUserData,
        profile,
        serviceSubscriberUser.id,
      );
    });

    return authTokenPayload;
  }

  async signin(signinDto: SignInDto) {
    //
    const userData = await this.authenticateUserOnAuthServer('signin', {
      signinDto,
    });

    const profileSummary = await this.profileService.getProfileSummary(
      userData.id,
    );

    console.log('userData', userData);

    const serviceProvider: string = undefined;
    if (profileSummary.profileType === ProfileTypes.SERVICE_PROVIDER_USER) {
      // TODO: handle case for service provider user
    }
    const authTokenPayload = this.generateAuthToken(
      userData,
      profileSummary,
      serviceProvider,
    );

    return authTokenPayload;
  }

  async generateAuthToken(
    userData: AuthenticatedUserData & { isVerified: boolean },
    profile: ProfileSummaryTokenData,
    serviceProviderId?: string,
  ) {
    const authPayload: AuthTokenPayload = {
      userData: omit(userData, ['isVerified']),
      profile: {
        id: profile.id,
        profileType: profile.profileType,
        profileTypeId: profile.profileTypeId,
        ...(serviceProviderId ? { serviceProviderId } : {}),
      },
      services: {
        name: '',
      }
    };

    const token = this.sharedService.signPayload(authPayload);
    return {
      token,
    };
  }
}
