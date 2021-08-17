import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from 'nestjs-ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { SharedModule } from './shared/shared.module';
import { FeaturesModule } from './features/features.module';

import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import redisConfig from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, redisConfig]
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbConfig.uri'),
      }),
      inject: [ConfigService],
    }),
    EventModule,
    RedisModule.forAsync(
      [
        {
          name: 'REDIS_PUBLISHER_CLIENT',
        },
        {
          name: 'REDIS_SUBSCRIBER_CLIENT',
        }
      ],
      {
        useFactory: (configService: ConfigService) => {
          const config = configService.get('redisConfig')
          return [
            {
              name: 'REDIS_PUBLISHER_CLIENT',
              host: config.host,
              port: config.port,
              password: config.password,
              db: config.db,
              tls: config.tls,
            },
            {
              name: 'REDIS_SUBSCRIBER_CLIENT',
              host: config.host,
              port: config.port,
              password: config.password,
              db: config.db,
              tls: config.tls,
            },

          ]
        },
        inject: [ConfigService]
      }),
    SharedModule,
    FeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {
}
