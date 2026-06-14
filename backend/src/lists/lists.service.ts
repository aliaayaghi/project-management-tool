import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ProjectList } from './list.model';

@Injectable()
export class ListsService {
  private lists: ProjectList[] = [];

  findAllForBoard(boardId: string): ProjectList[] {
    return this.lists.filter((list) => list.boardId === boardId);
  }

  findOne(boardId: string, listId: string): ProjectList {
    const list = this.lists.find(
      (list) => list.boardId === boardId && list.id === listId,
    );

    if (!list) {
      throw new NotFoundException(
        `List with id "${listId}" not found on board "${boardId}"`,
      );
    }

    return list;
  }

  create(boardId: string, createListDto: CreateListDto): ProjectList {
    const now = new Date();

    const list: ProjectList = {
      id: crypto.randomUUID(),
      boardId,
      title: createListDto.title,
      status: createListDto.status,
      position: createListDto.position ?? this.findAllForBoard(boardId).length,
      createdAt: now,
      updatedAt: now,
    };

    this.lists.push(list);

    return list;
  }

  update(
    boardId: string,
    listId: string,
    updateListDto: UpdateListDto,
  ): ProjectList {
    const list = this.findOne(boardId, listId);

    const updatedList: ProjectList = {
      ...list,
      ...updateListDto,
      updatedAt: new Date(),
    };

    this.lists = this.lists.map((list) =>
      list.boardId === boardId && list.id === listId ? updatedList : list,
    );

    return updatedList;
  }

  remove(boardId: string, listId: string): ProjectList {
    const list = this.findOne(boardId, listId);

    this.lists = this.lists.filter(
      (list) => !(list.boardId === boardId && list.id === listId),
    );

    return list;
  }
}
