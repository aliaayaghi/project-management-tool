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
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { RequestWithUser } from '../auth/request-with-user.type';

@Controller('boards/:boardId/lists/:listId/cards')
@UseGuards(JwtAuthGuard)
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  findAllForList(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.cardsService.findAllForList(boardId, listId, request.user.id);
  }

  @Get(':cardId')
  findOne(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Param('cardId') cardId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.cardsService.findOne(
      boardId,
      listId,
      cardId,
      request.user.id,
    );
  }

  @Post()
  create(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Body() createCardDto: CreateCardDto,
    @Req() request: RequestWithUser,
  ) {
    return this.cardsService.create(
      boardId,
      listId,
      createCardDto,
      request.user.id,
    );
  }

  @Patch(':cardId')
  update(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Param('cardId') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
    @Req() request: RequestWithUser,
  ) {
    return this.cardsService.update(
      boardId,
      listId,
      cardId,
      updateCardDto,
      request.user.id,
    );
  }

  @Delete(':cardId')
  remove(
    @Param('boardId') boardId: string,
    @Param('listId') listId: string,
    @Param('cardId') cardId: string,
    @Req() request: RequestWithUser,
  ) {
    return this.cardsService.remove(
      boardId,
      listId,
      cardId,
      request.user.id,
    );
  }
}
