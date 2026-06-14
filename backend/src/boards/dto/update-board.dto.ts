import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { BoardVisibility } from '../board.model';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsIn(['private', 'shared'])
  visibility?: BoardVisibility;
}
