import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { RedisSocketEventSendDTO } from '../shared/redis-propagator/dto/socket-event-send.dto';
import { RedisService } from '../shared/redis/redis.service';
import { FeatureDto } from './dto/feature.dto';
import { FeaturesService } from './features.service';

@Controller('features')
export class FeaturesController {
  constructor(
    private readonly service: FeaturesService,
    private readonly redisService: RedisService
    ) {
      this.redisService.fromEvent('localhost:3000')
      .pipe(tap(this.consumeSendEventForSameUser))
      .subscribe();
    }

    private consumeSendEventForSameUser = (eventInfo: RedisSocketEventSendDTO): void => {
      const { userId, event, data } = eventInfo;
      this.saveFeature(data as FeatureDto);
    };

  @Get('status')
  getFeature(@Query('t') path: string) {
    return this.service.getFeature(path);
  }

  @Post('status')
  saveFeature(@Body(new ValidationPipe()) dto: FeatureDto) {
    return this.service.saveFeature(dto);
  }
}
