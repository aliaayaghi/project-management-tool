import { Injectable, NotFoundException } from '@nestjs/common';
import { ListStatus as PrismaListStatus } from '../../generated/prisma/client';
import { BoardsService } from '../boards/boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ProjectList } from './list.model';

type ProjectListRow = Omit<ProjectList, 'status'> & {
  status: string;
};

@Injectable()
export class ListsService {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly prisma: PrismaService,
  ) {}

  async findAllForBoard(
    boardId: string,
    userId: string,
  ): Promise<ProjectList[]> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const lists = await this.prisma.projectList.findMany({
      where: { boardId },
      orderBy: { position: 'asc' },
    });

    return lists.map((list) => this.toListModel(list));
  }

  async findOne(
    boardId: string,
    listId: string,
    userId: string,
  ): Promise<ProjectList> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const list = await this.prisma.projectList.findFirst({
      where: { id: listId, boardId },
    });

    if (!list) {
      throw new NotFoundException(
        `List with id "${listId}" not found on board "${boardId}"`,
      );
    }

    return this.toListModel(list);
  }

  async create(
    boardId: string,
    createListDto: CreateListDto,
    userId: string,
  ): Promise<ProjectList> {
    await this.boardsService.assertBoardAccess(boardId, userId);

    const position =
      createListDto.position ??
      (await this.prisma.projectList.count({
        where: { boardId },
      }));

    const list = await this.prisma.projectList.create({
      data: {
        boardId,
        title: createListDto.title,
        status: this.toPrismaListStatus(createListDto.status),
        position,
      },
    });

    return this.toListModel(list);
  }

  async update(
    boardId: string,
    listId: string,
    updateListDto: UpdateListDto,
    userId: string,
  ): Promise<ProjectList> {
    await this.findOne(boardId, listId, userId);

    const { status, ...listUpdateData } = updateListDto;

    const updatedList = await this.prisma.projectList.update({
      where: { id: listId },
      data: {
        ...listUpdateData,
        ...(status !== undefined
          ? { status: this.toPrismaListStatus(status) }
          : {}),
      },
    });

    return this.toListModel(updatedList);
  }

  async remove(
    boardId: string,
    listId: string,
    userId: string,
  ): Promise<ProjectList> {
    const list = await this.findOne(boardId, listId, userId);

    await this.prisma.projectList.delete({
      where: { id: listId },
    });

    return list;
  }

  private toListModel(list: ProjectListRow): ProjectList {
    return {
      ...list,
      status:
        list.status === PrismaListStatus.in_progress
          ? 'in-progress'
          : (list.status as ProjectList['status']),
    };
  }

  private toPrismaListStatus(status: ProjectList['status']): PrismaListStatus {
    return status === 'in-progress' ? PrismaListStatus.in_progress : status;
  }
}
