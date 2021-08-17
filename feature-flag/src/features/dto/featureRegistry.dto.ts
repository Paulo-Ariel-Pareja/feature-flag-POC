import { IsBoolean, IsEnum, IsString, Length } from 'class-validator';
import { FeatureEnum } from '../enum/feature.enums';

export class FeatureRegistryDto {

  @IsString()
  @Length(1)
  readonly id_front: string;

  @IsBoolean()
  readonly enable: boolean;
  
  @IsBoolean()
  readonly visible: boolean;
  
  @IsString()
  @Length(1)
  readonly host: string;

  @IsString()
  @Length(1)
  readonly path: string;

  @IsEnum(FeatureEnum)
  readonly method: string;

  @IsBoolean()
  readonly status: boolean;
}
