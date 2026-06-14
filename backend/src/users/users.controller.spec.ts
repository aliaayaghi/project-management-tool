import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', () => {
    expect(controller.findAll()).toEqual([]);
  });

  it('should create a user', () => {
    const user = controller.create({
      name: 'Ehab',
      email: 'ehab@example.com',
    });

    expect(user).toMatchObject({
      name: 'Ehab',
      email: 'ehab@example.com',
    });
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });

  it('should return one user by id', () => {
    const user = controller.create({
      name: 'Ehab',
      email: 'ehab@example.com',
    });

    expect(controller.findOne(user.id)).toEqual(user);
  });

  it('should throw NotFoundException when user does not exist', () => {
    expect(() => controller.findOne('missing-user-id')).toThrow(
      NotFoundException,
    );
  });

  it('should update a user', () => {
    const user = controller.create({
      name: 'Ehab',
      email: 'ehab@example.com',
    });

    const updatedUser = controller.update(user.id, {
      name: 'Ehab N.',
    });

    expect(updatedUser).toMatchObject({
      id: user.id,
      name: 'Ehab N.',
      email: 'ehab@example.com',
      createdAt: user.createdAt,
    });
  });

  it('should throw when updating a missing user', () => {
    expect(() =>
      controller.update('missing-user-id', {
        name: 'Updated name',
      }),
    ).toThrow();
  });

  it('should remove a user', () => {
    const user = controller.create({
      name: 'Ehab',
      email: 'ehab@example.com',
    });

    expect(controller.remove(user.id)).toEqual(user);
    expect(controller.findAll()).toEqual([]);
  });

  it('should throw when removing a missing user', () => {
    expect(() => controller.remove('missing-user-id')).toThrow();
  });
});
