import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ListsService } from './lists.service';

describe('ListsService', () => {
  let service: ListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListsService],
    }).compile();

    service = module.get<ListsService>(ListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all lists for a board', () => {
    expect(service.findAllForBoard('board-1')).toEqual([]);
  });

  it('should create a list', () => {
    const list = service.create('board-1', {
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
    expect(service.findAllForBoard('board-1')).toEqual([list]);
  });

  it('should create a list with a custom position', () => {
    const list = service.create('board-1', {
      title: 'Done',
      position: 2,
    });

    expect(list.position).toBe(2);
  });

  it('should return one list by id', () => {
    const list = service.create('board-1', {
      title: 'To Do',
    });

    expect(service.findOne('board-1', list.id)).toEqual(list);
  });

  it('should throw NotFoundException when list does not exist', () => {
    expect(() => service.findOne('board-1', 'missing-list-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a list', () => {
    const list = service.create('board-1', {
      title: 'To Do',
    });

    const updatedList = service.update('board-1', list.id, {
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
    expect(updatedList.updatedAt.getTime()).toBeGreaterThanOrEqual(
      list.updatedAt.getTime(),
    );
    expect(service.findOne('board-1', list.id)).toEqual(updatedList);
  });

  it('should throw NotFoundException when updating a missing list', () => {
    expect(() =>
      service.update('board-1', 'missing-list-id', {
        title: 'Updated title',
      }),
    ).toThrow(NotFoundException);
  });

  it('should remove a list', () => {
    const list = service.create('board-1', {
      title: 'To Do',
    });

    expect(service.remove('board-1', list.id)).toEqual(list);
    expect(service.findAllForBoard('board-1')).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing list', () => {
    expect(() => service.remove('board-1', 'missing-list-id')).toThrow(
      NotFoundException,
    );
  });
});
