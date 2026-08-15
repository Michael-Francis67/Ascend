import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsObject()
  @IsNotEmpty()
  value!: any;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  group?: string;
}
