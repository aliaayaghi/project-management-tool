import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('BoardsController', () => {
  let controller: BoardsController;
  const request = { user: { id: 'user-1', email: 'ehab@example.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [BoardsService],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all boards', () => {
    expect(controller.findAll(request)).toEqual([]);
  });

  it('should create a board', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, request);

    expect(board).toMatchObject({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
      ownerId: 'user-1',
      memberIds: [],
    });

    expect(board.id).toBeDefined();
    expect(board.createdAt).toBeInstanceOf(Date);
    expect(board.updatedAt).toBeInstanceOf(Date);
  });

  it('should return one board by id', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, request);

    expect(controller.findOne(board.id, request)).toEqual(board);
  });

  it('should throw NotFoundException when board does not exist', () => {
    expect(() => controller.findOne('missing-board-id', request)).toThrow(
      NotFoundException,
    );
  });
  it('should update a board', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, request);

    const updatedBoard = controller.update(board.id, {
      title: 'Website launch',
      visibility: 'shared',
    }, request);

    expect(updatedBoard).toMatchObject({
      id: board.id,
      title: 'Website launch',
      description: 'Plan the new landing page',
      visibility: 'shared',
      ownerId: 'user-1',
      memberIds: [],
      createdAt: board.createdAt,
    });
  });

  it('should throw when updating a missing board', () => {
    expect(() =>
      controller.update('missing-board-id', {
        title: 'Updated title',
      }, request),
    ).toThrow();
  });

  it('should remove a board', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, request);

    expect(controller.remove(board.id, request)).toEqual(board);
    expect(controller.findAll(request)).toEqual([]);
  });

  it('should throw when removing a missing board', () => {
    expect(() => controller.remove('missing-board-id', request)).toThrow();
  });
});
