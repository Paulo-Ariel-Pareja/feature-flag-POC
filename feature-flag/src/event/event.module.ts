import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from '../shared/shared.module';
import { EventGateway } from './event.gateway';
import { HttpModule } from '@nestjs/axios';
import { FeaturesService } from '../features/features.service';
import { FeaturesController } from '../features/features.controller';
import { FeatureSchema } from '../features/schemas/features.schema';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
          }),
        MongooseModule.forFeature([
            { name: 'Feature', schema: FeatureSchema }
        ]),
        SharedModule,
    ],
    controllers: [FeaturesController],
    providers: [
        EventGateway,
        FeaturesService
    ]
})
export class EventModule { }
