import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { ListStatus } from '../list.model';

export class UpdateListDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsIn(['todo', 'in-progress', 'done'])
  status?: ListStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
