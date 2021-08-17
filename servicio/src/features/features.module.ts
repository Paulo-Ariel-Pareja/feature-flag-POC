import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RedisService } from '../shared/redis/redis.service';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [FeaturesController],
  providers: [FeaturesService, RedisService],
  exports: [FeaturesService],
})
export class FeaturesModule {}
