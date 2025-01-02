import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RequestService } from './request/request.service';
import { HelpersService } from './helpers/helpers.service';
import { ProfileService } from './profile/profile.service';
import { HttpModule } from '@nestjs/axios';
import { FileService } from './file/file.service';
import { FileController } from './file/file.controller';
import { AwsS3Service } from './file/aws-s3/aws-s3.service';
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      async useFactory(configService: ConfigService) {
        await ConfigModule.envVariablesLoaded;

        return {
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRY', '8h'),
          },
          secret: configService.get('JWT_SECRET'),
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
  ],
  providers: [
    SharedService,
    JwtService,
    RequestService,
    HelpersService,
    ProfileService,
    FileService,
    AwsS3Service,
  ],
  exports: [
    SharedService,
    JwtService,
    HelpersService,
    ProfileService,
    RequestService,
  ],
  controllers: [FileController],
})
export class SharedModule {}
