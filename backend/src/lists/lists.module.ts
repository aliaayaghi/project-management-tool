import { Module } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';

@Module({
  imports: [BoardsModule, PrismaModule],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
