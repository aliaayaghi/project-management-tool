import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../boards/boards.service';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

describe('CardsController', () => {
  let controller: CardsController;
  let boardsService: BoardsService;
  let boardId: string;
  const listId = 'list-1';
  const request = { user: { id: 'user-1', email: 'ehab@example.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService, BoardsService],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    boardsService = module.get<BoardsService>(BoardsService);
    boardId = boardsService.create(
      {
        title: 'Website redesign',
        visibility: 'private',
      },
      request.user.id,
    ).id;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all cards for a list', () => {
    expect(controller.findAllForList(boardId, listId, request)).toEqual([]);
  });

  it('should create a card', () => {
    const card = controller.create(boardId, listId, {
      title: 'Create login page',
      description: 'Build the Vue login form',
    }, request);

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
  });

  it('should return one card by id', () => {
    const card = controller.create(boardId, listId, {
      title: 'Create login page',
    }, request);

    expect(controller.findOne(boardId, listId, card.id, request)).toEqual(card);
  });

  it('should throw NotFoundException when card does not exist', () => {
    expect(() =>
      controller.findOne(boardId, listId, 'missing-card-id', request),
    ).toThrow(NotFoundException);
  });

  it('should update a card', () => {
    const card = controller.create(boardId, listId, {
      title: 'Create login page',
      description: 'Build the Vue login form',
    }, request);

    const updatedCard = controller.update(boardId, listId, card.id, {
      title: 'Create register page',
      position: 1,
    }, request);

    expect(updatedCard).toMatchObject({
      id: card.id,
      boardId,
      listId,
      title: 'Create register page',
      description: 'Build the Vue login form',
      position: 1,
      createdAt: card.createdAt,
    });
  });

  it('should throw when updating a missing card', () => {
    expect(() =>
      controller.update(boardId, listId, 'missing-card-id', {
        title: 'Updated title',
      }, request),
    ).toThrow();
  });

  it('should remove a card', () => {
    const card = controller.create(boardId, listId, {
      title: 'Create login page',
    }, request);

    expect(controller.remove(boardId, listId, card.id, request)).toEqual(card);
    expect(controller.findAllForList(boardId, listId, request)).toEqual([]);
  });

  it('should throw when removing a missing card', () => {
    expect(() =>
      controller.remove(boardId, listId, 'missing-card-id', request),
    ).toThrow();
  });
});
