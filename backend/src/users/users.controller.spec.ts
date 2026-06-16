import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const user = {
    id: 'user-1',
    name: 'Ehab',
    email: 'ehab@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const usersService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    usersService.findAll.mockResolvedValue([user]);

    await expect(controller.findAll()).resolves.toEqual([user]);
    expect(usersService.findAll).toHaveBeenCalledWith();
  });

  it('should create a user', async () => {
    const input = {
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    };
    usersService.create.mockResolvedValue(user);

    await expect(controller.create(input)).resolves.toEqual(user);
    expect(usersService.create).toHaveBeenCalledWith(input);
  });

  it('should return one user by id', async () => {
    usersService.findOne.mockResolvedValue(user);

    await expect(controller.findOne(user.id)).resolves.toEqual(user);
    expect(usersService.findOne).toHaveBeenCalledWith(user.id);
  });

  it('should update a user', async () => {
    const input = { name: 'Ehab N.' };
    const updatedUser = { ...user, ...input };
    usersService.update.mockResolvedValue(updatedUser);

    await expect(controller.update(user.id, input)).resolves.toEqual(
      updatedUser,
    );
    expect(usersService.update).toHaveBeenCalledWith(user.id, input);
  });

  it('should remove a user', async () => {
    usersService.remove.mockResolvedValue(user);

    await expect(controller.remove(user.id)).resolves.toEqual(user);
    expect(usersService.remove).toHaveBeenCalledWith(user.id);
  });
});
