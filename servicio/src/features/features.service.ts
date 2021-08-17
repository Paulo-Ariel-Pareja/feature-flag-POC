import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { FeatureDto } from './dto/feature.dto';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class FeaturesService implements OnModuleInit {
  constructor(private httpService: HttpService) {}
  private features = new Map<string, boolean>();

  async onModuleInit() {
    console.log(`Initialization...`);
    const responseData = this.httpService
      .get('http://localhost:3200/features?t=localhost:3000')
      .pipe(
        map((response) => {
          return response.data;
        }),
      );
    const response = (await lastValueFrom(responseData)) as any;
    response.forEach((param) => {
      this.features.set(`${param.path}-${param.method}`, param.status);
    });
  }

  public getFeature(pathMethod: string): boolean {
    return this.features.get(pathMethod) || false;
  }

  public saveFeature(dto: FeatureDto): string {
    this.features.set(`${dto.path}-${dto.method}`, dto.status);
    return 'saved';
  }
}
