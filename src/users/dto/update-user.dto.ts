import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUrl,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio: string;
}
