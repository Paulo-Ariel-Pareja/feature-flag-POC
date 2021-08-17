import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable, map } from 'rxjs';

import { FeatureDto } from './dto/feature.dto';
import { Feature } from './models/feature.models';
import { FeatureRegistryDto } from './dto/featureRegistry.dto';

@Injectable()
export class FeaturesService {
    constructor(
        private httpService: HttpService,
        @InjectModel('Feature') private readonly model: Model<Feature>,
    ) { }

    async getAllStatusForHost(host: string): Promise<Feature[]> {
        return await this.model.find({host});

    }

    async save(data: FeatureRegistryDto) {
        const result = await this.model.findOne({ id_front: data.id_front });
        if (!result){
            const newFeature = new this.model(data);
            return await newFeature.save()
        }
         return await this.model.findOneAndUpdate(
            { id_front: data.id_front },
            {
                enable: data.enable,
                visible: data.visible,
                host: data.host,
                path: data.path,
                method: data.method,
                status: data.status,
            },
            {new: true}
            );
    }

    changeStatus(host: string, data: FeatureDto): Observable<AxiosResponse<any>> {
        return this.httpService.post(`http://localhost:3000/features/status`, {
            path: data.path,
            method: data.method,
            status: data.status
        })
            .pipe(
                map(response => {
                    return response.data
                })
            );
    } catch(error) {
        console.log(error.message);
        throw error;
    }
}
