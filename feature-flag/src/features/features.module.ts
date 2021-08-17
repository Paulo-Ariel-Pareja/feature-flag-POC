import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { FeatureSchema } from './schemas/features.schema';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      { name: 'Feature', schema: FeatureSchema }
  ]),
  ],
  providers: [FeaturesService],
  controllers: [FeaturesController]
})
export class FeaturesModule {}
