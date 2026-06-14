import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.model';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  private boards: Board[] = [];

  findAll(): Board[] {
    return this.boards;
  }

  findOne(id: string): Board {
    const board = this.boards.find((board) => board.id === id);

    if (!board) {
      throw new NotFoundException(`Board with id "${id}" not found`);
    }

    return board;
  }

  create(createBoardDto: CreateBoardDto): Board {
    const now = new Date();

    const board: Board = {
      id: crypto.randomUUID(),
      title: createBoardDto.title,
      description: createBoardDto.description,
      visibility: createBoardDto.visibility,
      ownerId: createBoardDto.ownerId,
      createdAt: now,
      updatedAt: now,
    };

    this.boards.push(board);

    return board;
  }

  update(id: string, updateBoardDto: UpdateBoardDto): Board {
    const board = this.findOne(id);

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

  remove(id: string): Board {
    const board = this.findOne(id);

    this.boards = this.boards.filter((board) => board.id !== id);

    return board;
  }
}
