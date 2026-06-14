import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    const user = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  create(createUserDto: CreateUserDto): User {
    const now = new Date();

    const user: User = {
      id: crypto.randomUUID(),
      name: createUserDto.name,
      email: createUserDto.email,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto): User {
    const user = this.findOne(id);

    const updatedUser: User = {
      ...user,
      ...updateUserDto,
      updatedAt: new Date(),
    };

    this.users = this.users.map((user) =>
      user.id === id ? updatedUser : user,
    );

    return updatedUser;
  }

  remove(id: string): User {
    const user = this.findOne(id);

    this.users = this.users.filter((user) => user.id !== id);

    return user;
  }
}
