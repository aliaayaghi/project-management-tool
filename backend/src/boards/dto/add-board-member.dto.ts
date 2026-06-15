import { IsString, MinLength } from 'class-validator';

export class AddBoardMemberDto {
  @IsString()
  @MinLength(1)
  userId: string;
}
