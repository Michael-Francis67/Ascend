import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsObject()
  @IsNotEmpty()
  content: any;

  @IsString()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  order?: number;
}
