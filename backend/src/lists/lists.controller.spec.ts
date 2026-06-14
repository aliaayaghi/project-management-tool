import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

describe('ListsController', () => {
  let controller: ListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListsController],
      providers: [ListsService],
    }).compile();

    controller = module.get<ListsController>(ListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all lists for a board', () => {
    expect(controller.findAllForBoard('board-1')).toEqual([]);
  });

  it('should create a list', () => {
    const list = controller.create('board-1', {
      title: 'To Do',
    });

    expect(list).toMatchObject({
      boardId: 'board-1',
      title: 'To Do',
      position: 0,
    });
    expect(list.id).toBeDefined();
    expect(list.createdAt).toBeInstanceOf(Date);
    expect(list.updatedAt).toBeInstanceOf(Date);
  });

  it('should return one list by id', () => {
    const list = controller.create('board-1', {
      title: 'To Do',
    });

    expect(controller.findOne('board-1', list.id)).toEqual(list);
  });

  it('should throw NotFoundException when list does not exist', () => {
    expect(() => controller.findOne('board-1', 'missing-list-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a list', () => {
    const list = controller.create('board-1', {
      title: 'To Do',
    });

    const updatedList = controller.update('board-1', list.id, {
      title: 'In Progress',
      position: 1,
    });

    expect(updatedList).toMatchObject({
      id: list.id,
      boardId: 'board-1',
      title: 'In Progress',
      position: 1,
      createdAt: list.createdAt,
    });
  });

  it('should throw when updating a missing list', () => {
    expect(() =>
      controller.update('board-1', 'missing-list-id', {
        title: 'Updated title',
      }),
    ).toThrow();
  });

  it('should remove a list', () => {
    const list = controller.create('board-1', {
      title: 'To Do',
    });

    expect(controller.remove('board-1', list.id)).toEqual(list);
    expect(controller.findAllForBoard('board-1')).toEqual([]);
  });

  it('should throw when removing a missing list', () => {
    expect(() => controller.remove('board-1', 'missing-list-id')).toThrow();
  });
});
