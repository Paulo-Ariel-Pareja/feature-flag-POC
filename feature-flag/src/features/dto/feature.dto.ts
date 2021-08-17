import { IsBoolean, IsEnum, IsString, Length } from 'class-validator';
import { FeatureEnum } from '../enum/feature.enums';

export class FeatureDto {
  @IsString()
  @Length(1)
  readonly path: string;

  @IsEnum(FeatureEnum)
  readonly method: string;

  @IsBoolean()
  readonly status: boolean;
}
