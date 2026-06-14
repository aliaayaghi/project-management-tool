import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { ListStatus } from '../list.model';

export class CreateListDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsIn(['todo', 'in-progress', 'done'])
  status: ListStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
