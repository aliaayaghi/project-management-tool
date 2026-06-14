import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
