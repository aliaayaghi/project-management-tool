import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../boards/boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { Card } from './card.model';
import { CardsService } from './cards.service';

type CardRow = Omit<Card, 'description'> & {
  description: string | null;
};

function createPrismaStub() {
  let idCounter = 1;
  let cards: CardRow[] = [];

  return {
    card: {
      findMany: jest.fn(({ where }) =>
        cards
          .filter(
            (card) =>
              card.boardId === where.boardId && card.listId === where.listId,
          )
          .sort(
            (firstCard, secondCard) => firstCard.position - secondCard.position,
          ),
      ),
      findFirst: jest.fn(
        ({ where }) =>
          cards.find(
            (card) =>
              card.id === where.id &&
              card.boardId === where.boardId &&
              card.listId === where.listId,
          ) ?? null,
      ),
      count: jest.fn(
        ({ where }) =>
          cards.filter(
            (card) =>
              card.boardId === where.boardId && card.listId === where.listId,
          ).length,
      ),
      create: jest.fn(({ data }) => {
        const now = new Date();
        const card = {
          id: `card-${idCounter++}`,
          boardId: data.boardId,
          listId: data.listId,
          title: data.title,
          description: data.description ?? null,
          position: data.position,
          createdAt: now,
          updatedAt: now,
        };

        cards.push(card);

        return card;
      }),
      update: jest.fn(({ where, data }) => {
        const card = cards.find((currentCard) => currentCard.id === where.id);

        if (!card) {
          throw new Error('Card not found');
        }

        const updatedCard = {
          ...card,
          ...data,
          updatedAt: new Date(),
        };

        cards = cards.map((currentCard) =>
          currentCard.id === where.id ? updatedCard : currentCard,
        );

        return updatedCard;
      }),
      delete: jest.fn(({ where }) => {
        cards = cards.filter((card) => card.id !== where.id);
      }),
    },
  };
}

describe('CardsService', () => {
  let service: CardsService;
  const boardId = 'board-1';
  const listId = 'list-1';
  const userId = 'user-1';
  const boardsService = {
    assertBoardAccess: jest.fn(),
  };

  beforeEach(async () => {
    boardsService.assertBoardAccess.mockResolvedValue({ id: boardId });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: BoardsService,
          useValue: boardsService,
        },
        {
          provide: PrismaService,
          useValue: createPrismaStub(),
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all cards for a list', async () => {
    expect(await service.findAllForList(boardId, listId, userId)).toEqual([]);
    expect(boardsService.assertBoardAccess).toHaveBeenCalledWith(
      boardId,
      userId,
    );
  });

  it('should create a card', async () => {
    const card = await service.create(
      boardId,
      listId,
      {
        title: 'Create login page',
        description: 'Build the Vue login form',
      },
      userId,
    );

    expect(card).toMatchObject({
      boardId,
      listId,
      title: 'Create login page',
      description: 'Build the Vue login form',
      position: 0,
    });
    expect(card.id).toBeDefined();
    expect(card.createdAt).toBeInstanceOf(Date);
    expect(card.updatedAt).toBeInstanceOf(Date);
    expect(await service.findAllForList(boardId, listId, userId)).toEqual([
      card,
    ]);
  });

  it('should create a card with a custom position', async () => {
    const card = await service.create(
      boardId,
      listId,
      {
        title: 'Create login page',
        position: 2,
      },
      userId,
    );

    expect(card.position).toBe(2);
  });

  it('should return one card by id', async () => {
    const card = await service.create(
      boardId,
      listId,
      {
        title: 'Create login page',
      },
      userId,
    );

    expect(await service.findOne(boardId, listId, card.id, userId)).toEqual(
      card,
    );
  });

  it('should throw NotFoundException when card does not exist', async () => {
    await expect(
      service.findOne(boardId, listId, 'missing-card-id', userId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a card', async () => {
    const card = await service.create(
      boardId,
      listId,
      {
        title: 'Create login page',
        description: 'Build the Vue login form',
      },
      userId,
    );

    const updatedCard = await service.update(
      boardId,
      listId,
      card.id,
      {
        title: 'Create register page',
        position: 1,
      },
      userId,
    );

    expect(updatedCard).toMatchObject({
      id: card.id,
      boardId,
      listId,
      title: 'Create register page',
      description: 'Build the Vue login form',
      position: 1,
      createdAt: card.createdAt,
    });
    expect(updatedCard.updatedAt.getTime()).toBeGreaterThanOrEqual(
      card.updatedAt.getTime(),
    );
    expect(await service.findOne(boardId, listId, card.id, userId)).toEqual(
      updatedCard,
    );
  });

  it('should move a card to another list', async () => {
    const card = await service.create(
      boardId,
      listId,
      {
        title: 'Polish validation',
        description: 'Keep drag and drop working',
      },
      userId,
    );

    const movedCard = await service.update(
      boardId,
      listId,
      card.id,
      {
        listId: 'list-2',
      },
      userId,
    );

    expect(movedCard).toMatchObject({
      id: card.id,
      boardId,
      listId: 'list-2',
      title: 'Polish validation',
      description: 'Keep drag and drop working',
      position: 0,
    });
  });

  it('should throw NotFoundException when updating a missing card', async () => {
    await expect(
      service.update(
        boardId,
        listId,
        'missing-card-id',
        {
          title: 'Updated title',
        },
        userId,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a card', async () => {
    const card = await service.create(
      boardId,
      listId,
      {
        title: 'Create login page',
      },
      userId,
    );

    expect(await service.remove(boardId, listId, card.id, userId)).toEqual(
      card,
    );
    expect(await service.findAllForList(boardId, listId, userId)).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing card', async () => {
    await expect(
      service.remove(boardId, listId, 'missing-card-id', userId),
    ).rejects.toThrow(NotFoundException);
  });
});
