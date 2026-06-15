import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardsService],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all boards', () => {
    expect(service.findAllForUser('user-1')).toEqual([]);
  });

  it('should create a board', () => {
    const board = service.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, 'user-1');

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
    expect(service.findAllForUser('user-1')).toEqual([board]);
  });

  it('should return one board by id', () => {
    const board = service.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, 'user-1');

    expect(service.findOneForUser(board.id, 'user-1')).toEqual(board);
  });

  it('should throw NotFoundException when board does not exist', () => {
    expect(() => service.findOne('missing-board-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a board', () => {
    const board = service.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, 'user-1');

    const updatedBoard = service.update(board.id, {
      title: 'Website launch',
      visibility: 'shared',
    }, 'user-1');

    expect(updatedBoard).toMatchObject({
      id: board.id,
      title: 'Website launch',
      description: 'Plan the new landing page',
      visibility: 'shared',
      ownerId: 'user-1',
      memberIds: [],
      createdAt: board.createdAt,
    });

    expect(updatedBoard.updatedAt.getTime()).toBeGreaterThanOrEqual(
      board.updatedAt.getTime(),
    );

    expect(service.findOne(board.id)).toEqual(updatedBoard);
  });

  it('should throw NotFoundException when updating a missing board', () => {
    expect(() =>
      service.update('missing-board-id', {
        title: 'Updated title',
      }, 'user-1'),
    ).toThrow(NotFoundException);
  });

  it('should remove a board', () => {
    const board = service.create({
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private',
    }, 'user-1');

    expect(service.remove(board.id, 'user-1')).toEqual(board);
    expect(service.findAllForUser('user-1')).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing board', () => {
    expect(() => service.remove('missing-board-id', 'user-1')).toThrow(NotFoundException);
  });
});
