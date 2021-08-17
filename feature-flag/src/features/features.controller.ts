import { Body, Controller, Get, Post, Query, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

import { FeatureRegistryDto } from './dto/featureRegistry.dto';
import { FeaturesService } from './features.service';
import { RedisPropagatorRestInterceptor } from '../shared/redis-propagator/redis-propagator-rest.interceptor';
import { EventsEnum } from '../event/enums/events.enums';


@UseInterceptors(RedisPropagatorRestInterceptor)
@Controller('features')
export class FeaturesController {
    constructor(
        private readonly service: FeaturesService
    ) { }

    @Post()
    async saveStatus(@Body(new ValidationPipe()) dto: FeatureRegistryDto) {
        const saved = await this.service.save(dto);

        // envia request a servicio via http
        // para actualizar por medio de pub/sub dejar comentado
        // las siguientes dos lineas
/*         const responseData = this.service.changeStatus(dto.host, dto);
        await lastValueFrom(responseData) as any; */

        return {
            status: 'ok',
            data: saved,
            events: [
                { event: EventsEnum.EVENTTOFRONTEND, data: saved, sender: 'front' },
                // para NO notificar por pub/sub comentar la linea siguiente
                { event: EventsEnum.EVENTTOBACKEND, data: saved, sender: saved.host }
            ]
        }
    }

    @Get()
    getStatus(@Query('t') path: string) {
        return this.service.getAllStatusForHost(path);
    }
}
