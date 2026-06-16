import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from '../boards/boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { ListsService } from './lists.service';
import { ProjectList } from './list.model';

type ProjectListRow = Omit<ProjectList, 'status'> & {
  status: string;
};

function createPrismaStub() {
  let idCounter = 1;
  let lists: ProjectListRow[] = [];

  return {
    projectList: {
      findMany: jest.fn(({ where }) =>
        lists
          .filter((list) => list.boardId === where.boardId)
          .sort((firstList, secondList) => firstList.position - secondList.position),
      ),
      findFirst: jest.fn(({ where }) =>
        lists.find(
          (list) => list.id === where.id && list.boardId === where.boardId,
        ) ?? null,
      ),
      count: jest.fn(({ where }) =>
        lists.filter((list) => list.boardId === where.boardId).length,
      ),
      create: jest.fn(({ data }) => {
        const now = new Date();
        const list = {
          id: `list-${idCounter++}`,
          boardId: data.boardId,
          title: data.title,
          status: data.status ?? 'todo',
          position: data.position,
          createdAt: now,
          updatedAt: now,
        };

        lists.push(list);

        return list;
      }),
      update: jest.fn(({ where, data }) => {
        const list = lists.find((currentList) => currentList.id === where.id);

        if (!list) {
          throw new Error('List not found');
        }

        const updatedList = {
          ...list,
          ...data,
          updatedAt: new Date(),
        };

        lists = lists.map((currentList) =>
          currentList.id === where.id ? updatedList : currentList,
        );

        return updatedList;
      }),
      delete: jest.fn(({ where }) => {
        lists = lists.filter((list) => list.id !== where.id);
      }),
    },
  };
}

describe('ListsService', () => {
  let service: ListsService;
  const boardId = 'board-1';
  const userId = 'user-1';
  const boardsService = {
    assertBoardAccess: jest.fn(),
  };

  beforeEach(async () => {
    boardsService.assertBoardAccess.mockResolvedValue({ id: boardId });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListsService,
        {
          provide: BoardsService,
          useValue: boardsService,
        },
        {
          provide: PrismaService,
          useValue: createPrismaStub(),
        },
      ],
    }).compile();

    service = module.get<ListsService>(ListsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all lists for a board', async () => {
    expect(await service.findAllForBoard(boardId, userId)).toEqual([]);
    expect(boardsService.assertBoardAccess).toHaveBeenCalledWith(
      boardId,
      userId,
    );
  });

  it('should create a list', async () => {
    const list = await service.create(
      boardId,
      {
        title: 'To Do',
        status: 'todo',
      },
      userId,
    );

    expect(list).toMatchObject({
      boardId,
      title: 'To Do',
      status: 'todo',
      position: 0,
    });
    expect(list.id).toBeDefined();
    expect(list.createdAt).toBeInstanceOf(Date);
    expect(list.updatedAt).toBeInstanceOf(Date);
    expect(await service.findAllForBoard(boardId, userId)).toEqual([list]);
  });

  it('should create a list with a custom position', async () => {
    const list = await service.create(
      boardId,
      {
        title: 'Done',
        status: 'done',
        position: 2,
      },
      userId,
    );

    expect(list.position).toBe(2);
  });

  it('should return one list by id', async () => {
    const list = await service.create(
      boardId,
      {
        title: 'To Do',
        status: 'todo',
      },
      userId,
    );

    expect(await service.findOne(boardId, list.id, userId)).toEqual(list);
  });

  it('should throw NotFoundException when list does not exist', async () => {
    await expect(
      service.findOne(boardId, 'missing-list-id', userId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update a list', async () => {
    const list = await service.create(
      boardId,
      {
        title: 'To Do',
        status: 'todo',
      },
      userId,
    );

    const updatedList = await service.update(
      boardId,
      list.id,
      {
        title: 'In Progress',
        position: 1,
      },
      userId,
    );

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
    expect(await service.findOne(boardId, list.id, userId)).toEqual(
      updatedList,
    );
  });

  it('should throw NotFoundException when updating a missing list', async () => {
    await expect(
      service.update(
        boardId,
        'missing-list-id',
        {
          title: 'Updated title',
        },
        userId,
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a list', async () => {
    const list = await service.create(
      boardId,
      {
        title: 'To Do',
        status: 'todo',
      },
      userId,
    );

    expect(await service.remove(boardId, list.id, userId)).toEqual(list);
    expect(await service.findAllForBoard(boardId, userId)).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing list', async () => {
    await expect(
      service.remove(boardId, 'missing-list-id', userId),
    ).rejects.toThrow(NotFoundException);
  });
});
