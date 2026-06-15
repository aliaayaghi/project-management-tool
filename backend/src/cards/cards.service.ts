import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardsService } from '../boards/boards.service';
import { Card } from './card.model';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  private cards: Card[] = [];

  constructor(private readonly boardsService: BoardsService) {}

  findAllForList(boardId: string, listId: string, userId: string): Card[] {
    this.boardsService.assertBoardAccess(boardId, userId);

    return this.cards.filter(
      (card) => card.boardId === boardId && card.listId === listId,
    );
  }

  findOne(
    boardId: string,
    listId: string,
    cardId: string,
    userId: string,
  ): Card {
    this.boardsService.assertBoardAccess(boardId, userId);

    const card = this.cards.find(
      (card) =>
        card.boardId === boardId &&
        card.listId === listId &&
        card.id === cardId,
    );

    if (!card) {
      throw new NotFoundException(
        `Card with id "${cardId}" not found on list "${listId}"`,
      );
    }

    return card;
  }

  create(
    boardId: string,
    listId: string,
    createCardDto: CreateCardDto,
    userId: string,
  ): Card {
    this.boardsService.assertBoardAccess(boardId, userId);

    const now = new Date();

    const card: Card = {
      id: crypto.randomUUID(),
      boardId,
      listId,
      title: createCardDto.title,
      description: createCardDto.description,
      position:
        createCardDto.position ??
        this.cards.filter(
          (card) => card.boardId === boardId && card.listId === listId,
        ).length,
      createdAt: now,
      updatedAt: now,
    };

    this.cards.push(card);

    return card;
  }

  update(
    boardId: string,
    listId: string,
    cardId: string,
    updateCardDto: UpdateCardDto,
    userId: string,
  ): Card {
    const card = this.findOne(boardId, listId, cardId, userId);

    const updatedCard: Card = {
      ...card,
      ...(updateCardDto.title !== undefined
        ? { title: updateCardDto.title }
        : {}),
      ...(updateCardDto.description !== undefined
        ? { description: updateCardDto.description }
        : {}),
      ...(updateCardDto.position !== undefined
        ? { position: updateCardDto.position }
        : {}),
      ...(updateCardDto.listId !== undefined
        ? { listId: updateCardDto.listId }
        : {}),
      updatedAt: new Date(),
    };

    this.cards = this.cards.map((card) =>
      card.boardId === boardId && card.listId === listId && card.id === cardId
        ? updatedCard
        : card,
    );

    return updatedCard;
  }

  remove(
    boardId: string,
    listId: string,
    cardId: string,
    userId: string,
  ): Card {
    const card = this.findOne(boardId, listId, cardId, userId);

    this.cards = this.cards.filter(
      (card) =>
        !(
          card.boardId === boardId &&
          card.listId === listId &&
          card.id === cardId
        ),
    );

    return card;
  }
}
