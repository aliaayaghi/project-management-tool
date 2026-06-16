import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Board } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

type BoardWithMembers = {
  id: string;
  title: string;
  description: string | null;
  visibility: string;
  ownerId: string;
  members: Array<{ userId: string }>;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForUser(userId: string): Promise<Board[]> {
    const boards = await this.prisma.board.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      include: { members: true },
    });

    return boards.map((board) => this.toBoardModel(board));
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.prisma.board.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!board) {
      throw new NotFoundException(`Board with id "${id}" not found`);
    }

    return this.toBoardModel(board);
  }

  async findOneForUser(id: string, userId: string): Promise<Board> {
    const board = await this.findOne(id);

    if (!this.canAccessBoard(board, userId)) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return board;
  }

  async create(
    createBoardDto: CreateBoardDto,
    ownerId: string,
  ): Promise<Board> {
    const board = await this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        description: createBoardDto.description,
        visibility: createBoardDto.visibility,
        ownerId,
      },
      include: { members: true },
    });

    return this.toBoardModel(board);
  }

  async update(
    id: string,
    updateBoardDto: UpdateBoardDto,
    userId: string,
  ): Promise<Board> {
    const board = await this.findOne(id);
    this.assertOwner(board, userId);

    const updatedBoard = await this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
      include: { members: true },
    });

    return this.toBoardModel(updatedBoard);
  }

  async remove(id: string, userId: string): Promise<Board> {
    const board = await this.findOne(id);
    this.assertOwner(board, userId);

    await this.prisma.board.delete({
      where: { id },
    });

    return board;
  }

  async addMember(
    id: string,
    ownerId: string,
    memberId: string,
  ): Promise<Board> {
    const board = await this.findOne(id);
    this.assertOwner(board, ownerId);

    if (memberId === board.ownerId || board.memberIds.includes(memberId)) {
      return board;
    }

    const updatedBoard = await this.prisma.board.update({
      where: { id },
      data: {
        visibility: 'shared',
        members: {
          create: { userId: memberId },
        },
      },
      include: { members: true },
    });

    return this.toBoardModel(updatedBoard);
  }

  async removeMember(
    id: string,
    ownerId: string,
    memberId: string,
  ): Promise<Board> {
    const board = await this.findOne(id);
    this.assertOwner(board, ownerId);

    await this.prisma.boardMember.deleteMany({
      where: { boardId: id, userId: memberId },
    });

    const updatedBoard = await this.prisma.board.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!updatedBoard) {
      throw new NotFoundException(`Board with id "${id}" not found`);
    }

    return this.toBoardModel(updatedBoard);
  }

  async assertBoardAccess(id: string, userId: string): Promise<Board> {
    return this.findOneForUser(id, userId);
  }

  private canAccessBoard(board: Board, userId: string): boolean {
    return board.ownerId === userId || board.memberIds.includes(userId);
  }

  private assertOwner(board: Board, userId: string) {
    if (board.ownerId !== userId) {
      throw new ForbiddenException('Only the board owner can do this');
    }
  }

  private toBoardModel(board: BoardWithMembers): Board {
    return {
      id: board.id,
      title: board.title,
      description: board.description ?? undefined,
      visibility: board.visibility as Board['visibility'],
      ownerId: board.ownerId,
      memberIds: board.members.map((member) => member.userId),
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }
}
