import * as bcrypt from 'bcrypt';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ListStatus, PrismaClient } from '../generated/prisma/client';
import { getSqliteFilePath } from '../src/prisma/sqlite-url';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({
    url: getSqliteFilePath(),
  }),
});

async function main() {
  const passwordHash = bcrypt.hashSync('password123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo Owner',
      email: 'demo@example.com',
      passwordHash,
    },
  });

  const member = await prisma.user.upsert({
    where: { email: 'member@example.com' },
    update: {},
    create: {
      name: 'Demo Member',
      email: 'member@example.com',
      passwordHash,
    },
  });

  const existingBoard = await prisma.board.findFirst({
    where: {
      ownerId: owner.id,
      title: 'Website Launch',
    },
  });

  if (existingBoard) {
    return;
  }

  const board = await prisma.board.create({
    data: {
      title: 'Website Launch',
      description: 'Sample board created by the seed script',
      visibility: 'shared',
      ownerId: owner.id,
      members: {
        create: {
          userId: member.id,
        },
      },
    },
  });

  const todo = await prisma.projectList.create({
    data: {
      boardId: board.id,
      title: 'To do',
      status: 'todo',
      position: 1,
    },
  });

  const inProgress = await prisma.projectList.create({
    data: {
      boardId: board.id,
      title: 'In progress',
      status: ListStatus.in_progress,
      position: 2,
    },
  });

  const done = await prisma.projectList.create({
    data: {
      boardId: board.id,
      title: 'Done',
      status: 'done',
      position: 3,
    },
  });

  await prisma.card.createMany({
    data: [
      {
        boardId: board.id,
        listId: todo.id,
        title: 'Write launch checklist',
        description: 'Collect the tasks needed before release',
        position: 0,
      },
      {
        boardId: board.id,
        listId: inProgress.id,
        title: 'Build authentication flow',
        description: 'Register, login, and protected API calls',
        position: 0,
      },
      {
        boardId: board.id,
        listId: done.id,
        title: 'Create project board layout',
        description: 'Board, lists, and cards render in the frontend',
        position: 0,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
