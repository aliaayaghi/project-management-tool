import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';
import { User } from './user.model';

function createPrismaStub() {
  let idCounter = 1;
  let users: User[] = [];

  return {
    user: {
      findMany: jest.fn(() => users),
      findUnique: jest.fn(({ where }) => {
        if ('id' in where) {
          return users.find((user) => user.id === where.id) ?? null;
        }

        return users.find((user) => user.email === where.email) ?? null;
      }),
      create: jest.fn(({ data }) => {
        const now = new Date();
        const user = {
          id: `user-${idCounter++}`,
          name: data.name,
          email: data.email,
          passwordHash: data.passwordHash,
          createdAt: now,
          updatedAt: now,
        };

        users.push(user);

        return user;
      }),
      update: jest.fn(({ where, data }) => {
        const user = users.find((currentUser) => currentUser.id === where.id);

        if (!user) {
          throw new Error('User not found');
        }

        const updatedUser = {
          ...user,
          ...data,
          updatedAt: new Date(),
        };

        users = users.map((currentUser) =>
          currentUser.id === where.id ? updatedUser : currentUser,
        );

        return updatedUser;
      }),
      delete: jest.fn(({ where }) => {
        const user = users.find((currentUser) => currentUser.id === where.id);

        if (!user) {
          throw new Error('User not found');
        }

        users = users.filter((currentUser) => currentUser.id !== where.id);

        return user;
      }),
    },
  };
}

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: createPrismaStub(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    expect(await service.findAll()).toEqual([]);
  });

  it('should create a user without exposing the password hash', async () => {
    const user = await service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    expect(user).toMatchObject({
      name: 'Ehab',
      email: 'ehab@example.com',
    });
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
    expect(user).not.toHaveProperty('passwordHash');
    expect(await service.findAll()).toEqual([user]);
  });

  it('should reject duplicate emails', async () => {
    await service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    await expect(
      service.create({
        name: 'Other',
        email: 'ehab@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should return one user by id', async () => {
    const user = await service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    expect(await service.findOne(user.id)).toEqual(user);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    await expect(service.findOne('missing-user-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a user', async () => {
    const user = await service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    const updatedUser = await service.update(user.id, {
      name: 'Ehab N.',
    });

    expect(updatedUser).toMatchObject({
      id: user.id,
      name: 'Ehab N.',
      email: 'ehab@example.com',
      createdAt: user.createdAt,
    });
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThanOrEqual(
      user.updatedAt.getTime(),
    );
    expect(await service.findOne(user.id)).toEqual(updatedUser);
  });

  it('should throw NotFoundException when updating a missing user', async () => {
    await expect(
      service.update('missing-user-id', {
        name: 'Updated name',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a user', async () => {
    const user = await service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    expect(await service.remove(user.id)).toEqual(user);
    expect(await service.findAll()).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing user', async () => {
    await expect(service.remove('missing-user-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
