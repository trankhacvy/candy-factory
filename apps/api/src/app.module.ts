import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
// import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import mailConfig from './config/mail.config';
import fileConfig from './config/file.config';
import facebookConfig from './config/facebook.config';
import googleConfig from './config/google.config';
import twitterConfig from './config/twitter.config';
import appleConfig from './config/apple.config';
import solanaConfig from './config/solana.config';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { AuthAppleModule } from './auth-apple/auth-apple.module';
// import { AuthFacebookModule } from './auth-facebook/auth-facebook.module';
// import { AuthGoogleModule } from './auth-google/auth-google.module';
// import { AuthTwitterModule } from './auth-twitter/auth-twitter.module';
import { TypeOrmConfigService } from './database/typeorm-config.service';
// import { ForgotModule } from './forgot/forgot.module';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SessionModule } from './session/session.module';
import { AudiencesModule } from './audiences/audiences.module';
import { AudienceGroupsModule } from './audience-groups/audience-groups.module';
import { NFTsModule } from './nfts/nfts.module';
import { DropsModule } from './drops/drops.module';
import { SharedModule } from './shared/shared.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/interceptors/response-transform.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        facebookConfig,
        googleConfig,
        twitterConfig,
        appleConfig,
        solanaConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    // FilesModule,
    AuthModule,
    // AuthFacebookModule,
    // AuthGoogleModule,
    // AuthTwitterModule,
    // AuthAppleModule,
    // ForgotModule,
    SessionModule,
    HomeModule,
    AudiencesModule,
    AudienceGroupsModule,
    NFTsModule,
    DropsModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
