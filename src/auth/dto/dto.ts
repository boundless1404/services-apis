import { TokenCreationPurpose } from '@/src/lib/enums';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ServiceProviderUserSignupDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  phoneCodeId: string;
}

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // TODO: Implement password policy
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class VerificationDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsEnum(TokenCreationPurpose)
  @IsNotEmpty()
  tokenPurpose: TokenCreationPurpose;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResendTokenDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
