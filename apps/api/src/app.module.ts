import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import appConfig from './config/app.config';
import solanaConfig from './config/solana.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { HomeModule } from './home/home.module';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SessionModule } from './session/session.module';
import { AudiencesModule } from './audiences/audiences.module';
import { AudienceGroupsModule } from './audience-groups/audience-groups.module';
import { NFTsModule } from './nfts/nfts.module';
import { DropsModule } from './drops/drops.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SharedModule } from './shared/shared.module';
import { StatModule } from './stats/StatsModule';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformInterceptor } from './utils/interceptors/response-transform.interceptor';
import { BullModule } from '@nestjs/bull';
import { AllConfigType } from './config/config.type';
import redisConfig from './config/redis.config';
import { SetupModule } from './setup/SetupModule';
import { JobsModule } from './jobs/Jobs.module';
import { JOBS_QUEUE } from './utils/job';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, appConfig, solanaConfig, redisConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    UsersModule,
    SessionModule,
    HomeModule,
    AudiencesModule,
    AudienceGroupsModule,
    NFTsModule,
    DropsModule,
    TransactionsModule,
    SharedModule,
    AuthModule,
    StatModule,
    SetupModule,
    JobsModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AllConfigType>) => {
        return {
          redis: {
            host: configService.get('redis.host', {
              infer: true,
            }),
            username: configService.get('redis.username', {
              infer: true,
            }),
            password: configService.get('redis.password', {
              infer: true,
            }),
            port: configService.get('redis.port', {
              infer: true,
            }),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
