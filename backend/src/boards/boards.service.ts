import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Board } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  findAllForUser(userId: string): Board[] {
    return this.boards.filter((board) => this.canAccessBoard(board, userId));
  }

  findOne(id: string): Board {
    const board = this.boards.find((board) => board.id === id);

    if (!board) {
      throw new NotFoundException(`Board with id "${id}" not found`);
    }

    return board;
  }

  findOneForUser(id: string, userId: string): Board {
    const board = this.findOne(id);

    if (!this.canAccessBoard(board, userId)) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return board;
  }

  create(createBoardDto: CreateBoardDto, ownerId: string): Board {
    const now = new Date();

    const board: Board = {
      id: crypto.randomUUID(),
      title: createBoardDto.title,
      description: createBoardDto.description,
      visibility: createBoardDto.visibility,
      ownerId,
      memberIds: [],
      createdAt: now,
      updatedAt: now,
    };

    this.boards.push(board);

    return board;
  }

  update(id: string, updateBoardDto: UpdateBoardDto, userId: string): Board {
    const board = this.findOne(id);
    this.assertOwner(board, userId);

    const updatedBoard: Board = {
      ...board,
      ...updateBoardDto,
      updatedAt: new Date(),
    };

    this.boards = this.boards.map((board) =>
      board.id === id ? updatedBoard : board,
    );

    return updatedBoard;
  }

  remove(id: string, userId: string): Board {
    const board = this.findOne(id);
    this.assertOwner(board, userId);

    this.boards = this.boards.filter((board) => board.id !== id);

    return board;
  }

  addMember(id: string, ownerId: string, memberId: string): Board {
    const board = this.findOne(id);
    this.assertOwner(board, ownerId);

    if (memberId === board.ownerId || board.memberIds.includes(memberId)) {
      return board;
    }

    const updatedBoard: Board = {
      ...board,
      visibility: 'shared',
      memberIds: [...board.memberIds, memberId],
      updatedAt: new Date(),
    };

    this.boards = this.boards.map((board) =>
      board.id === id ? updatedBoard : board,
    );

    return updatedBoard;
  }

  removeMember(id: string, ownerId: string, memberId: string): Board {
    const board = this.findOne(id);
    this.assertOwner(board, ownerId);

    const updatedBoard: Board = {
      ...board,
      memberIds: board.memberIds.filter((currentId) => currentId !== memberId),
      updatedAt: new Date(),
    };

    this.boards = this.boards.map((board) =>
      board.id === id ? updatedBoard : board,
    );

    return updatedBoard;
  }

  assertBoardAccess(id: string, userId: string): Board {
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
}
