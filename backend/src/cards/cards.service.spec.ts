import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../boards/boards.service';
import { CardsService } from './cards.service';

describe('CardsService', () => {
  let service: CardsService;
  let boardsService: BoardsService;
  let boardId: string;
  const listId = 'list-1';
  const userId = 'user-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService, BoardsService],
    }).compile();

    service = module.get<CardsService>(CardsService);
    boardsService = module.get<BoardsService>(BoardsService);
    boardId = boardsService.create(
      {
        title: 'Website redesign',
        visibility: 'private',
      },
      userId,
    ).id;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all cards for a list', () => {
    expect(service.findAllForList(boardId, listId, userId)).toEqual([]);
  });

  it('should create a card', () => {
    const card = service.create(boardId, listId, {
      title: 'Create login page',
      description: 'Build the Vue login form',
    }, userId);

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
    expect(service.findAllForList(boardId, listId, userId)).toEqual([card]);
  });

  it('should create a card with a custom position', () => {
    const card = service.create(boardId, listId, {
      title: 'Create login page',
      position: 2,
    }, userId);

    expect(card.position).toBe(2);
  });

  it('should return one card by id', () => {
    const card = service.create(boardId, listId, {
      title: 'Create login page',
    }, userId);

    expect(service.findOne(boardId, listId, card.id, userId)).toEqual(card);
  });

  it('should throw NotFoundException when card does not exist', () => {
    expect(() =>
      service.findOne(boardId, listId, 'missing-card-id', userId),
    ).toThrow(NotFoundException);
  });

  it('should update a card', () => {
    const card = service.create(boardId, listId, {
      title: 'Create login page',
      description: 'Build the Vue login form',
    }, userId);

    const updatedCard = service.update(boardId, listId, card.id, {
      title: 'Create register page',
      position: 1,
    }, userId);

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
    expect(service.findOne(boardId, listId, card.id, userId)).toEqual(
      updatedCard,
    );
  });

  it('should throw NotFoundException when updating a missing card', () => {
    expect(() =>
      service.update(boardId, listId, 'missing-card-id', {
        title: 'Updated title',
      }, userId),
    ).toThrow(NotFoundException);
  });

  it('should remove a card', () => {
    const card = service.create(boardId, listId, {
      title: 'Create login page',
    }, userId);

    expect(service.remove(boardId, listId, card.id, userId)).toEqual(card);
    expect(service.findAllForList(boardId, listId, userId)).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing card', () => {
    expect(() =>
      service.remove(boardId, listId, 'missing-card-id', userId),
    ).toThrow(NotFoundException);
  });
});
