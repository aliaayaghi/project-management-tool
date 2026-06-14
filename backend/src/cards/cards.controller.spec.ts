import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

describe('CardsController', () => {
  let controller: CardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [CardsService],
    }).compile();

    controller = module.get<CardsController>(CardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all cards for a list', () => {
    expect(controller.findAllForList('board-1', 'list-1')).toEqual([]);
  });

  it('should create a card', () => {
    const card = controller.create('board-1', 'list-1', {
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
  });

  it('should return one card by id', () => {
    const card = controller.create('board-1', 'list-1', {
      title: 'Create login page',
    });

    expect(controller.findOne('board-1', 'list-1', card.id)).toEqual(card);
  });

  it('should throw NotFoundException when card does not exist', () => {
    expect(() =>
      controller.findOne('board-1', 'list-1', 'missing-card-id'),
    ).toThrow(NotFoundException);
  });

  it('should update a card', () => {
    const card = controller.create('board-1', 'list-1', {
      title: 'Create login page',
      description: 'Build the Vue login form',
    });

    const updatedCard = controller.update('board-1', 'list-1', card.id, {
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
  });

  it('should throw when updating a missing card', () => {
    expect(() =>
      controller.update('board-1', 'list-1', 'missing-card-id', {
        title: 'Updated title',
      }),
    ).toThrow();
  });

  it('should remove a card', () => {
    const card = controller.create('board-1', 'list-1', {
      title: 'Create login page',
    });

    expect(controller.remove('board-1', 'list-1', card.id)).toEqual(card);
    expect(controller.findAllForList('board-1', 'list-1')).toEqual([]);
  });

  it('should throw when removing a missing card', () => {
    expect(() =>
      controller.remove('board-1', 'list-1', 'missing-card-id'),
    ).toThrow();
  });
});
