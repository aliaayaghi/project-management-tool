import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('BoardsController', () => {
  let controller: BoardsController;

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
    expect(controller.findAll()).toEqual([]);
  });

  it('should create a board', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
      ownerId: 'user-1',
    });

    expect(board).toMatchObject({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
      ownerId: 'user-1',
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
      ownerId: 'user-1',
    });

    expect(controller.findOne(board.id)).toEqual(board);
  });

  it('should throw NotFoundException when board does not exist', () => {
    expect(() => controller.findOne('missing-board-id')).toThrow(
      NotFoundException,
    );
  });
  it('should update a board', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
      ownerId: 'user-1',
    });

    const updatedBoard = controller.update(board.id, {
      title: 'Website launch',
      visibility: 'shared',
    });

    expect(updatedBoard).toMatchObject({
      id: board.id,
      title: 'Website launch',
      description: 'Plan the new landing page',
      visibility: 'shared',
      ownerId: 'user-1',
      createdAt: board.createdAt,
    });
  });

  it('should throw when updating a missing board', () => {
    expect(() =>
      controller.update('missing-board-id', {
        title: 'Updated title',
      }),
    ).toThrow();
  });

  it('should remove a board', () => {
    const board = controller.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
      ownerId: 'user-1',
    });

    expect(controller.remove(board.id)).toEqual(board);
    expect(controller.findAll()).toEqual([]);
  });

  it('should throw when removing a missing board', () => {
    expect(() => controller.remove('missing-board-id')).toThrow();
  });
});
