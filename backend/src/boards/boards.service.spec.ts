import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { PrismaService } from '../prisma/prisma.service';
import { BoardsService } from './boards.service';

type BoardRow = {
  id: string;
  title: string;
  description: string | null;
  visibility: string;
  ownerId: string;
  members: Array<{ userId: string }>;
  createdAt: Date;
  updatedAt: Date;
};

function createPrismaStub() {
  let idCounter = 1;
  let boards: BoardRow[] = [];

  const findBoard = (id: string) => boards.find((board) => board.id === id);

  return {
    board: {
      findMany: jest.fn(({ where }) =>
        boards.filter(
          (board) =>
            board.ownerId === where.OR[0].ownerId ||
            board.members.some(
              (member) => member.userId === where.OR[1].members.some.userId,
            ),
        ),
      ),
      findUnique: jest.fn(({ where }) => findBoard(where.id) ?? null),
      create: jest.fn(({ data }) => {
        const now = new Date();
        const board = {
          id: `board-${idCounter++}`,
          title: data.title,
          description: data.description ?? null,
          visibility: data.visibility,
          ownerId: data.ownerId,
          members: [],
          createdAt: now,
          updatedAt: now,
        };

        boards.push(board);

        return board;
      }),
      update: jest.fn(({ where, data }) => {
        const board = findBoard(where.id);

        if (!board) {
          throw new Error('Board not found');
        }

        const updatedBoard = {
          ...board,
          ...data,
          members: data.members?.create
            ? [...board.members, { userId: data.members.create.userId }]
            : board.members,
          updatedAt: new Date(),
        };

        boards = boards.map((currentBoard) =>
          currentBoard.id === where.id ? updatedBoard : currentBoard,
        );

        return updatedBoard;
      }),
      delete: jest.fn(({ where }) => {
        boards = boards.filter((board) => board.id !== where.id);
      }),
    },
    boardMember: {
      deleteMany: jest.fn(({ where }) => {
        const board = findBoard(where.boardId);

        if (board) {
          board.members = board.members.filter(
            (member) => member.userId !== where.userId,
          );
        }
      }),
    },
  };
}

describe('BoardsService', () => {
  let service: BoardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: PrismaService,
          useValue: createPrismaStub(),
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all boards for a user', async () => {
    expect(await service.findAllForUser('user-1')).toEqual([]);
  });

  it('should create a board', async () => {
    const board = await service.create(
      {
        title: 'Website redesign',
        description: 'Plan the new landing page',
        visibility: 'private',
      },
      'user-1',
    );

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
    expect(await service.findAllForUser('user-1')).toEqual([board]);
  });

  it('should return one board by id', async () => {
    const board = await service.create(
      {
        title: 'Website redesign',
        description: 'Plan the new landing page',
        visibility: 'private',
      },
      'user-1',
    );

    expect(await service.findOneForUser(board.id, 'user-1')).toEqual(board);
  });

  it('should throw NotFoundException when board does not exist', async () => {
    await expect(service.findOne('missing-board-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a board', async () => {
    const board = await service.create(
      {
        title: 'Website redesign',
        description: 'Plan the new landing page',
        visibility: 'private',
      },
      'user-1',
    );

    const updatedBoard = await service.update(
      board.id,
      {
        title: 'Website launch',
        visibility: 'shared',
      },
      'user-1',
    );

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

    expect(await service.findOne(board.id)).toEqual(updatedBoard);
  });

  it('should throw NotFoundException when updating a missing board', async () => {
    await expect(
      service.update(
        'missing-board-id',
        {
          title: 'Updated title',
        },
        'user-1',
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a board', async () => {
    const board = await service.create(
      {
        title: 'Website redesign',
        description: 'Plan the new landing page',
        visibility: 'private',
      },
      'user-1',
    );

    expect(await service.remove(board.id, 'user-1')).toEqual(board);
    expect(await service.findAllForUser('user-1')).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing board', async () => {
    await expect(service.remove('missing-board-id', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
