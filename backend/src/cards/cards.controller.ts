import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Controller('boards/:boardId/lists/:listId/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAllForList(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
  ) {
    return this.cardsService.findAllForList(boardId, listId);
  }

  @Get(':cardId')
  findOne(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Param('cardId') cardId: string,
  ) {
    return this.cardsService.findOne(boardId, listId, cardId);
  }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Body() createCardDto: CreateCardDto,
  ) {
    return this.cardsService.create(boardId, listId, createCardDto);
  }

  @Patch(':cardId')
  update(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    return this.cardsService.update(boardId, listId, cardId, updateCardDto);
  }

  @Delete(':cardId')
  remove(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Param('cardId') cardId: string,
  ) {
    return this.cardsService.remove(boardId, listId, cardId);
  }
}
