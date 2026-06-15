import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser, User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): PublicUser[] {
    return this.users.map((user) => this.toPublicUser(user));
  }

  findOne(id: string): PublicUser {
    return this.toPublicUser(this.findOneWithPassword(id));
  }

  findOneWithPassword(id: string): User {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  findByEmailWithPassword(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  create(createUserDto: CreateUserDto): PublicUser {
    const existingUser = this.findByEmailWithPassword(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const now = new Date();
    const passwordHash = bcrypt.hashSync(createUserDto.password, 10);

    const user: User = {
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);

    return this.toPublicUser(user);
  }

  update(id: string, updateUserDto: UpdateUserDto): PublicUser {
    const user = this.findOneWithPassword(id);

    const updatedUser: User = {
      ...user,
      ...updateUserDto,
      updatedAt: new Date(),
    };

    this.users = this.users.map((user) =>
      user.id === id ? updatedUser : user,
    );

    return this.toPublicUser(updatedUser);
  }

  remove(id: string): PublicUser {
    const user = this.findOneWithPassword(id);

    this.users = this.users.filter((user) => user.id !== id);

    return this.toPublicUser(user);
  }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;

    return publicUser;
  }
}
