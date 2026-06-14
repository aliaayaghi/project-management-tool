import { Injectable, NotFoundException } from '@nestjs/common';
import { Card } from './card.model';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  private cards: Card[] = [];

  findAllForList(boardId: string, listId: string): Card[] {
    return this.cards.filter(
      (card) => card.boardId === boardId && card.listId === listId,
    );
  }

  findOne(boardId: string, listId: string, cardId: string): Card {
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

  create(boardId: string, listId: string, createCardDto: CreateCardDto): Card {
    const now = new Date();

    const card: Card = {
      id: crypto.randomUUID(),
      boardId,
      listId,
      title: createCardDto.title,
      description: createCardDto.description,
      position:
        createCardDto.position ?? this.findAllForList(boardId, listId).length,
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
  ): Card {
    const card = this.findOne(boardId, listId, cardId);

    const updatedCard: Card = {
      ...card,
      ...updateCardDto,
      updatedAt: new Date(),
    };

    this.cards = this.cards.map((card) =>
      card.boardId === boardId && card.listId === listId && card.id === cardId
        ? updatedCard
        : card,
    );

    return updatedCard;
  }

  remove(boardId: string, listId: string, cardId: string): Card {
    const card = this.findOne(boardId, listId, cardId);

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
