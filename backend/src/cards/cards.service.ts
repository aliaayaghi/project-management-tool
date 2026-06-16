import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardsService } from '../boards/boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { Card } from './card.model';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

type CardRow = Omit<Card, 'description'> & {
  description: string | null;
};

@Injectable()
export class CardsService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly prisma: PrismaService,
  ) {}

  async findAllForList(
    boardId: string,
    listId: string,
    userId: string,
  ): Promise<Card[]> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const cards = await this.prisma.card.findMany({
      where: { boardId, listId },
      orderBy: { position: 'asc' },
    });

    return cards.map((card) => this.toCardModel(card));
  }

  async findOne(
    boardId: string,
    listId: string,
    cardId: string,
    userId: string,
  ): Promise<Card> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const card = await this.prisma.card.findFirst({
      where: { id: cardId, boardId, listId },
    });

    if (!card) {
      throw new NotFoundException(
        `Card with id "${cardId}" not found on list "${listId}"`,
      );
    }

    return this.toCardModel(card);
  }

  async create(
    boardId: string,
    listId: string,
    createCardDto: CreateCardDto,
    userId: string,
  ): Promise<Card> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const position =
      createCardDto.position ??
      (await this.prisma.card.count({
        where: { boardId, listId },
      }));

    const card = await this.prisma.card.create({
      data: {
        boardId,
        listId,
        title: createCardDto.title,
        description: createCardDto.description,
        position,
      },
    });

    return this.toCardModel(card);
  }

  async update(
    boardId: string,
    listId: string,
    cardId: string,
    updateCardDto: UpdateCardDto,
    userId: string,
  ): Promise<Card> {
    await this.findOne(boardId, listId, cardId, userId);

    const updatedCard = await this.prisma.card.update({
      where: { id: cardId },
      data: {
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
      },
    });

    return this.toCardModel(updatedCard);
  }

  async remove(
    boardId: string,
    listId: string,
    cardId: string,
    userId: string,
  ): Promise<Card> {
    const card = await this.findOne(boardId, listId, cardId, userId);

    await this.prisma.card.delete({
      where: { id: cardId },
    });

    return card;
  }

  private toCardModel(card: CardRow): Card {
    return {
      ...card,
      description: card.description ?? undefined,
    };
  }
}
