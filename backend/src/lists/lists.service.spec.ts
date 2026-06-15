import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../boards/boards.service';
import { ListsService } from './lists.service';

describe('ListsService', () => {
  let service: ListsService;
  let boardsService: BoardsService;
  let boardId: string;
  const userId = 'user-1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListsService, BoardsService],
    }).compile();

    service = module.get<ListsService>(ListsService);
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

  it('should return all lists for a board', () => {
    expect(service.findAllForBoard(boardId, userId)).toEqual([]);
  });

  it('should create a list', () => {
    const list = service.create(boardId, {
      title: 'To Do',
    }, userId);

    expect(list).toMatchObject({
      boardId,
      title: 'To Do',
      position: 0,
    });
    expect(list.id).toBeDefined();
    expect(list.createdAt).toBeInstanceOf(Date);
    expect(list.updatedAt).toBeInstanceOf(Date);
    expect(service.findAllForBoard(boardId, userId)).toEqual([list]);
  });

  it('should create a list with a custom position', () => {
    const list = service.create(boardId, {
      title: 'Done',
      position: 2,
    }, userId);

    expect(list.position).toBe(2);
  });

  it('should return one list by id', () => {
    const list = service.create(boardId, {
      title: 'To Do',
    }, userId);

    expect(service.findOne(boardId, list.id, userId)).toEqual(list);
  });

  it('should throw NotFoundException when list does not exist', () => {
    expect(() => service.findOne(boardId, 'missing-list-id', userId)).toThrow(
      NotFoundException,
    );
  });

  it('should update a list', () => {
    const list = service.create(boardId, {
      title: 'To Do',
    }, userId);

    const updatedList = service.update(boardId, list.id, {
      title: 'In Progress',
      position: 1,
    }, userId);

    expect(updatedList).toMatchObject({
      id: list.id,
      boardId,
      title: 'In Progress',
      position: 1,
      createdAt: list.createdAt,
    });
    expect(updatedList.updatedAt.getTime()).toBeGreaterThanOrEqual(
      list.updatedAt.getTime(),
    );
    expect(service.findOne(boardId, list.id, userId)).toEqual(updatedList);
  });

  it('should throw NotFoundException when updating a missing list', () => {
    expect(() =>
      service.update(boardId, 'missing-list-id', {
        title: 'Updated title',
      }, userId),
    ).toThrow(NotFoundException);
  });

  it('should remove a list', () => {
    const list = service.create(boardId, {
      title: 'To Do',
    }, userId);

    expect(service.remove(boardId, list.id, userId)).toEqual(list);
    expect(service.findAllForBoard(boardId, userId)).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing list', () => {
    expect(() => service.remove(boardId, 'missing-list-id', userId)).toThrow(
      NotFoundException,
    );
  });
});
