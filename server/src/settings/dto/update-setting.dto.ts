import { IsOptional, IsObject, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsObject()
  @IsOptional()
  value?: any;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  group?: string;
}
