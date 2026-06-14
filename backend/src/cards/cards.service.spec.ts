import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';

describe('CardsService', () => {
  let service: CardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService],
    }).compile();

    service = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all cards for a list', () => {
    expect(service.findAllForList('board-1', 'list-1')).toEqual([]);
  });

  it('should create a card', () => {
    const card = service.create('board-1', 'list-1', {
      title: 'Create login page',
      description: 'Build the Vue login form',
    });

    expect(card).toMatchObject({
      boardId: 'board-1',
      listId: 'list-1',
      title: 'Create login page',
      description: 'Build the Vue login form',
      position: 0,
    });
    expect(card.id).toBeDefined();
    expect(card.createdAt).toBeInstanceOf(Date);
    expect(card.updatedAt).toBeInstanceOf(Date);
    expect(service.findAllForList('board-1', 'list-1')).toEqual([card]);
  });

  it('should create a card with a custom position', () => {
    const card = service.create('board-1', 'list-1', {
      title: 'Create login page',
      position: 2,
    });

    expect(card.position).toBe(2);
  });

  it('should return one card by id', () => {
    const card = service.create('board-1', 'list-1', {
      title: 'Create login page',
    });

    expect(service.findOne('board-1', 'list-1', card.id)).toEqual(card);
  });

  it('should throw NotFoundException when card does not exist', () => {
    expect(() =>
      service.findOne('board-1', 'list-1', 'missing-card-id'),
    ).toThrow(NotFoundException);
  });

  it('should update a card', () => {
    const card = service.create('board-1', 'list-1', {
      title: 'Create login page',
      description: 'Build the Vue login form',
    });

    const updatedCard = service.update('board-1', 'list-1', card.id, {
      title: 'Create register page',
      position: 1,
    });

    expect(updatedCard).toMatchObject({
      id: card.id,
      boardId: 'board-1',
      listId: 'list-1',
      title: 'Create register page',
      description: 'Build the Vue login form',
      position: 1,
      createdAt: card.createdAt,
    });
    expect(updatedCard.updatedAt.getTime()).toBeGreaterThanOrEqual(
      card.updatedAt.getTime(),
    );
    expect(service.findOne('board-1', 'list-1', card.id)).toEqual(updatedCard);
  });

  it('should throw NotFoundException when updating a missing card', () => {
    expect(() =>
      service.update('board-1', 'list-1', 'missing-card-id', {
        title: 'Updated title',
      }),
    ).toThrow(NotFoundException);
  });

  it('should remove a card', () => {
    const card = service.create('board-1', 'list-1', {
      title: 'Create login page',
    });

    expect(service.remove('board-1', 'list-1', card.id)).toEqual(card);
    expect(service.findAllForList('board-1', 'list-1')).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing card', () => {
    expect(() =>
      service.remove('board-1', 'list-1', 'missing-card-id'),
    ).toThrow(NotFoundException);
  });
});
