import { Test, TestingModule } from '@nestjs/testing';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

describe('BoardsController', () => {
  let controller: BoardsController;
  const request = { user: { id: 'user-1', email: 'ehab@example.com' } } as any;
  const board = {
    id: 'board-1',
    title: 'Website redesign',
    description: 'Plan the new landing page',
    visibility: 'private' as const,
    ownerId: request.user.id,
    memberIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const boardsService = {
    findAllForUser: jest.fn(),
    findOneForUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addMember: jest.fn(),
    removeMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        {
          provide: BoardsService,
          useValue: boardsService,
        },
      ],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all boards for the authenticated user', async () => {
    boardsService.findAllForUser.mockResolvedValue([board]);

    await expect(controller.findAll(request)).resolves.toEqual([board]);
    expect(boardsService.findAllForUser).toHaveBeenCalledWith(request.user.id);
  });

  it('should create a board for the authenticated user', async () => {
    const input = {
      title: 'Website redesign',
      description: 'Plan the new landing page',
      visibility: 'private' as const,
    };
    boardsService.create.mockResolvedValue(board);

    await expect(controller.create(input, request)).resolves.toEqual(board);
    expect(boardsService.create).toHaveBeenCalledWith(input, request.user.id);
  });

  it('should return one board by id for the authenticated user', async () => {
    boardsService.findOneForUser.mockResolvedValue(board);

    await expect(controller.findOne(board.id, request)).resolves.toEqual(board);
    expect(boardsService.findOneForUser).toHaveBeenCalledWith(
      board.id,
      request.user.id,
    );
  });

  it('should update a board for the authenticated user', async () => {
    const input = { title: 'Website launch' };
    const updatedBoard = { ...board, ...input };
    boardsService.update.mockResolvedValue(updatedBoard);

    await expect(controller.update(board.id, input, request)).resolves.toEqual(
      updatedBoard,
    );
    expect(boardsService.update).toHaveBeenCalledWith(
      board.id,
      input,
      request.user.id,
    );
  });

  it('should remove a board for the authenticated user', async () => {
    boardsService.remove.mockResolvedValue(board);

    await expect(controller.remove(board.id, request)).resolves.toEqual(board);
    expect(boardsService.remove).toHaveBeenCalledWith(
      board.id,
      request.user.id,
    );
  });

  it('should add a board member as the authenticated owner', async () => {
    const updatedBoard = {
      ...board,
      visibility: 'shared' as const,
      memberIds: ['user-2'],
    };
    boardsService.addMember.mockResolvedValue(updatedBoard);

    await expect(
      controller.addMember(board.id, { userId: 'user-2' }, request),
    ).resolves.toEqual(updatedBoard);
    expect(boardsService.addMember).toHaveBeenCalledWith(
      board.id,
      request.user.id,
      'user-2',
    );
  });

  it('should remove a board member as the authenticated owner', async () => {
    boardsService.removeMember.mockResolvedValue(board);

    await expect(
      controller.removeMember(board.id, 'user-2', request),
    ).resolves.toEqual(board);
    expect(boardsService.removeMember).toHaveBeenCalledWith(
      board.id,
      request.user.id,
      'user-2',
    );
  });
});
