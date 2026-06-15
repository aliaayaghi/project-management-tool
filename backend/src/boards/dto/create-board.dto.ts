import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { BoardVisibility } from '../board.model';

export class CreateBoardDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsIn(['private', 'shared'])
  visibility: BoardVisibility;
}
