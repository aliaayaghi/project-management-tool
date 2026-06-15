import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../boards/boards.service';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

describe('ListsController', () => {
  let controller: ListsController;
  let boardsService: BoardsService;
  let boardId: string;
  const request = { user: { id: 'user-1', email: 'ehab@example.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListsController],
      providers: [ListsService, BoardsService],
    }).compile();

    controller = module.get<ListsController>(ListsController);
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

  it('should return all lists for a board', () => {
    expect(controller.findAllForBoard(boardId, request)).toEqual([]);
  });

  it('should create a list', () => {
    const list = controller.create(boardId, {
      title: 'To Do',
    }, request);

    expect(list).toMatchObject({
      boardId,
      title: 'To Do',
      position: 0,
    });
    expect(list.id).toBeDefined();
    expect(list.createdAt).toBeInstanceOf(Date);
    expect(list.updatedAt).toBeInstanceOf(Date);
  });

  it('should return one list by id', () => {
    const list = controller.create(boardId, {
      title: 'To Do',
    }, request);

    expect(controller.findOne(boardId, list.id, request)).toEqual(list);
  });

  it('should throw NotFoundException when list does not exist', () => {
    expect(() => controller.findOne(boardId, 'missing-list-id', request)).toThrow(
      NotFoundException,
    );
  });

  it('should update a list', () => {
    const list = controller.create(boardId, {
      title: 'To Do',
    }, request);

    const updatedList = controller.update(boardId, list.id, {
      title: 'In Progress',
      position: 1,
    }, request);

    expect(updatedList).toMatchObject({
      id: list.id,
      boardId,
      title: 'In Progress',
      position: 1,
      createdAt: list.createdAt,
    });
  });

  it('should throw when updating a missing list', () => {
    expect(() =>
      controller.update(boardId, 'missing-list-id', {
        title: 'Updated title',
      }, request),
    ).toThrow();
  });

  it('should remove a list', () => {
    const list = controller.create(boardId, {
      title: 'To Do',
    }, request);

    expect(controller.remove(boardId, list.id, request)).toEqual(list);
    expect(controller.findAllForBoard(boardId, request)).toEqual([]);
  });

  it('should throw when removing a missing list', () => {
    expect(() => controller.remove(boardId, 'missing-list-id', request)).toThrow();
  });
});
