import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListsService } from './lists.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/request-with-user.type';

@Controller('boards/:boardId/lists')
@UseGuards(JwtAuthGuard)
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findAllForBoard(
    @Param('boardId') boardId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.listsService.findAllForBoard(boardId, request.user.id);
  }

  @Get(':listId')
  findOne(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.listsService.findOne(boardId, listId, request.user.id);
  }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() createListDto: CreateListDto,
    @Req() request: RequestWithUser,
  ) {
    return this.listsService.create(boardId, createListDto, request.user.id);
  }

  @Patch(':listId')
  update(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Body() updateListDto: UpdateListDto,
    @Req() request: RequestWithUser,
  ) {
    return this.listsService.update(
      boardId,
      listId,
      updateListDto,
      request.user.id,
    );
  }

  @Delete(':listId')
  remove(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.listsService.remove(boardId, listId, request.user.id);
  }
}
