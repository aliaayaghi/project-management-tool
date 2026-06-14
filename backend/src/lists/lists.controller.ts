import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListsService } from './lists.service';

@Controller('boards/:boardId/lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get()
  findAllForBoard(@Param('boardId') boardId: string) {
    return this.listsService.findAllForBoard(boardId);
  }

  @Get(':listId')
  findOne(@Param('boardId') boardId: string, @Param('listId') listId: string) {
    return this.listsService.findOne(boardId, listId);
  }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Body() createListDto: CreateListDto,
  ) {
    return this.listsService.create(boardId, createListDto);
  }

  @Patch(':listId')
  update(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Body() updateListDto: UpdateListDto,
  ) {
    return this.listsService.update(boardId, listId, updateListDto);
  }

  @Delete(':listId')
  remove(@Param('boardId') boardId: string, @Param('listId') listId: string) {
    return this.listsService.remove(boardId, listId);
  }
}
