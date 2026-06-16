import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../../generated/prisma/client';
import { getSqliteFilePath } from './sqlite-url';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({
      adapter: new PrismaBetterSqlite3({
        url: getSqliteFilePath(),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
