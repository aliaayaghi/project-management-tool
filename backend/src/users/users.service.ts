import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser, User } from './user.model';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany();

    return users.map((user) => this.toPublicUser(user));
  }

  async findOne(id: string): Promise<PublicUser> {
    return this.toPublicUser(await this.findOneWithPassword(id));
  }

  async findOneWithPassword(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const existingUser = await this.findByEmailWithPassword(createUserDto.email);

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const passwordHash = bcrypt.hashSync(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        passwordHash,
      },
    });

    return this.toPublicUser(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<PublicUser> {
    await this.findOneWithPassword(id);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });

    return this.toPublicUser(updatedUser);
  }

  async remove(id: string): Promise<PublicUser> {
    await this.findOneWithPassword(id);

    const user = await this.prisma.user.delete({
      where: { id },
    });

    return this.toPublicUser(user);
  }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;

    return publicUser;
  }
}
