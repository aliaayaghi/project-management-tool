import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', () => {
    expect(service.findAll()).toEqual([]);
  });

  it('should create a user', () => {
    const user = service.create({
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
    expect(service.findAll()).toEqual([user]);
  });

  it('should return one user by id', () => {
    const user = service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    expect(service.findOne(user.id)).toEqual(user);
  });

  it('should throw NotFoundException when user does not exist', () => {
    expect(() => service.findOne('missing-user-id')).toThrow(NotFoundException);
  });

  it('should update a user', () => {
    const user = service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    const updatedUser = service.update(user.id, {
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
    expect(service.findOne(user.id)).toEqual(updatedUser);
  });

  it('should throw NotFoundException when updating a missing user', () => {
    expect(() =>
      service.update('missing-user-id', {
        name: 'Updated name',
      }),
    ).toThrow(NotFoundException);
  });

  it('should remove a user', () => {
    const user = service.create({
      name: 'Ehab',
      email: 'ehab@example.com',
      password: 'password123',
    });

    expect(service.remove(user.id)).toEqual(user);
    expect(service.findAll()).toEqual([]);
  });

  it('should throw NotFoundException when removing a missing user', () => {
    expect(() => service.remove('missing-user-id')).toThrow(NotFoundException);
  });
});
