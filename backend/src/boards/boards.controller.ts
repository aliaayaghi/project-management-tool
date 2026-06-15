import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AddBoardMemberDto } from './dto/add-board-member.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/request-with-user.type';

@Controller('boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@Req() request: RequestWithUser) {
    return this.boardsService.findAllForUser(request.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.boardsService.findOneForUser(id, request.user.id);
  }

  @Post()
  create(
    @Body() createBoardDto: CreateBoardDto,
    @Req() request: RequestWithUser,
  ) {
    return this.boardsService.create(createBoardDto, request.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() request: RequestWithUser,
  ) {
    return this.boardsService.update(id, updateBoardDto, request.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.boardsService.remove(id, request.user.id);
  }

  @Post(':id/members')
  addMember(
    @Param('id') id: string,
    @Body() addBoardMemberDto: AddBoardMemberDto,
    @Req() request: RequestWithUser,
  ) {
    return this.boardsService.addMember(
      id,
      request.user.id,
      addBoardMemberDto.userId,
    );
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.boardsService.removeMember(id, request.user.id, memberId);
  }
}
