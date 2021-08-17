import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-ioredis';

import appConfig from './config/app.config';
import redisConfig from './config/redis.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeaturesModule } from './features/features.module';
import { FeaturesMiddleware } from './middlewares/features.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, redisConfig]
    }),
    FeaturesModule,
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
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FeaturesMiddleware).forRoutes(AppController);
  }
}
