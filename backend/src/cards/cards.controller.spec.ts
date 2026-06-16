import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

describe('CardsController', () => {
  let controller: CardsController;
  const boardId = 'board-1';
  const listId = 'list-1';
  const request = { user: { id: 'user-1', email: 'ehab@example.com' } } as any;
  const card = {
    id: 'card-1',
    boardId,
    listId,
    title: 'Create login page',
    description: 'Build the Vue login form',
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const cardsService = {
    findAllForList: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: cardsService,
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all cards for a list', async () => {
    cardsService.findAllForList.mockResolvedValue([card]);

    await expect(
      controller.findAllForList(boardId, listId, request),
    ).resolves.toEqual([card]);
    expect(cardsService.findAllForList).toHaveBeenCalledWith(
      boardId,
      listId,
      request.user.id,
    );
  });

  it('should create a card for a list', async () => {
    const input = {
      title: 'Create login page',
      description: 'Build the Vue login form',
    };
    cardsService.create.mockResolvedValue(card);

    await expect(controller.create(boardId, listId, input, request)).resolves.toEqual(
      card,
    );
    expect(cardsService.create).toHaveBeenCalledWith(
      boardId,
      listId,
      input,
      request.user.id,
    );
  });

  it('should return one card by id', async () => {
    cardsService.findOne.mockResolvedValue(card);

    await expect(
      controller.findOne(boardId, listId, card.id, request),
    ).resolves.toEqual(card);
    expect(cardsService.findOne).toHaveBeenCalledWith(
      boardId,
      listId,
      card.id,
      request.user.id,
    );
  });

  it('should update a card', async () => {
    const input = { title: 'Create register page', position: 1 };
    const updatedCard = { ...card, ...input };
    cardsService.update.mockResolvedValue(updatedCard);

    await expect(
      controller.update(boardId, listId, card.id, input, request),
    ).resolves.toEqual(updatedCard);
    expect(cardsService.update).toHaveBeenCalledWith(
      boardId,
      listId,
      card.id,
      input,
      request.user.id,
    );
  });

  it('should remove a card', async () => {
    cardsService.remove.mockResolvedValue(card);

    await expect(
      controller.remove(boardId, listId, card.id, request),
    ).resolves.toEqual(card);
    expect(cardsService.remove).toHaveBeenCalledWith(
      boardId,
      listId,
      card.id,
      request.user.id,
    );
  });
});
