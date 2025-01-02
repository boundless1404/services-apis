import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ResendTokenDto,
  ServiceProviderUserSignupDto,
  SignInDto,
  VerificationDto,
} from './dto/dto';
import { AuthService } from './auth.service';
import { ProfileService } from '../shared/profile/profile.service';
import { SharedService } from '../shared/shared.service';
import { IsAuthenticated } from '../shared/isAuthenticated.guard';
import { GetAuthPayload } from '../shared/getAuthenticatedUserPayload.decorator';
import { AuthTokenPayload } from '../lib/types';
import { RateLimitGuard } from '../shared/rateLimit.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private profileService: ProfileService,
    private sharedService: SharedService,
  ) {
    //
  }

  // add rate limit to this endpoint
  @Get('phone-codes')
  @UseGuards(new RateLimitGuard({ windowMs: 60000, max: 5 }))
  async getPhoneCodes() {
    return await this.authService.getPhoneCodes();
  }

  @Post('signup')
  async signupCompanyUser(@Body() signupDto: ServiceProviderUserSignupDto) {
    //
    const authTokenResponse = await this.authService.signupSubscriber(
      signupDto,
    );
    return authTokenResponse;
  }
  @Post('resend-token')
  async ResendTokenVerification(@Body() resendTokenDto: ResendTokenDto) {
    return await this.authService.resendToken(resendTokenDto);
  }

  @Post('verify')
  async verifyToken(@Body() verificationDto: VerificationDto) {
    return await this.authService.verifyToken(verificationDto);
  }

  @Post('signin')
  async login(@Body() signinDto: SignInDto) {
    //
    const authTokenPayload = this.authService.signin(signinDto);
    return authTokenPayload;
  }

  @Get('user')
  @UseGuards(IsAuthenticated)
  async getUserDetails(@GetAuthPayload() authTokenPayload: AuthTokenPayload) {
    //
    return authTokenPayload;
  }
}
