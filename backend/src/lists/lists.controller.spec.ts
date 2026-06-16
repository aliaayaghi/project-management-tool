import { Test, TestingModule } from '@nestjs/testing';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

describe('ListsController', () => {
  let controller: ListsController;
  const boardId = 'board-1';
  const request = { user: { id: 'user-1', email: 'ehab@example.com' } } as any;
  const list = {
    id: 'list-1',
    boardId,
    title: 'To Do',
    status: 'todo' as const,
    position: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const listsService = {
    findAllForBoard: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListsController],
      providers: [
        {
          provide: ListsService,
          useValue: listsService,
        },
      ],
    }).compile();

    controller = module.get<ListsController>(ListsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all lists for a board', async () => {
    listsService.findAllForBoard.mockResolvedValue([list]);

    await expect(controller.findAllForBoard(boardId, request)).resolves.toEqual([
      list,
    ]);
    expect(listsService.findAllForBoard).toHaveBeenCalledWith(
      boardId,
      request.user.id,
    );
  });

  it('should create a list for a board', async () => {
    const input = {
      title: 'To Do',
      status: 'todo' as const,
      position: 0,
    };
    listsService.create.mockResolvedValue(list);

    await expect(controller.create(boardId, input, request)).resolves.toEqual(
      list,
    );
    expect(listsService.create).toHaveBeenCalledWith(
      boardId,
      input,
      request.user.id,
    );
  });

  it('should return one list by id', async () => {
    listsService.findOne.mockResolvedValue(list);

    await expect(controller.findOne(boardId, list.id, request)).resolves.toEqual(
      list,
    );
    expect(listsService.findOne).toHaveBeenCalledWith(
      boardId,
      list.id,
      request.user.id,
    );
  });

  it('should update a list', async () => {
    const input = { title: 'In Progress', position: 1 };
    const updatedList = { ...list, ...input };
    listsService.update.mockResolvedValue(updatedList);

    await expect(
      controller.update(boardId, list.id, input, request),
    ).resolves.toEqual(updatedList);
    expect(listsService.update).toHaveBeenCalledWith(
      boardId,
      list.id,
      input,
      request.user.id,
    );
  });

  it('should remove a list', async () => {
    listsService.remove.mockResolvedValue(list);

    await expect(controller.remove(boardId, list.id, request)).resolves.toEqual(
      list,
    );
    expect(listsService.remove).toHaveBeenCalledWith(
      boardId,
      list.id,
      request.user.id,
    );
  });
});
