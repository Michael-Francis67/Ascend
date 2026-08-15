import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;

  @IsArray()
  @IsOptional()
  gallery?: string[];

  @IsString()
  @IsNotEmpty()
  client!: string;

  @IsString()
  @IsOptional()
  results?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
