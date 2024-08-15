import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    title : string;

    @IsString()
    @IsNotEmpty()
    content :string;

    @IsOptional()
    @IsInt()
    category_id? :number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    image?: string;
}