import { MemoryController } from './memory/memory.controller';
import { MemoryService } from './memory/memory.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AiService } from './ai/ai.service';
import { AiController } from './ai/ai.controller';

@Module({
  imports: [],
  controllers: [AppController, MemoryController, AiController],
  providers: [AppService, PrismaService, MemoryService, AiService],
})
export class AppModule {}