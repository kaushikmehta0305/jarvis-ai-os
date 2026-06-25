import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemoryService {
  constructor(private prisma: PrismaService) {}

  async createMemory(content: string) {
    return this.prisma.memory.create({
      data: {
        content,
      },
    });
  }

  async getMemories() {
    return this.prisma.memory.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMemoryById(id: string) {
    return this.prisma.memory.findUnique({
      where: {
        id,
      },
    });
  }

  async updateMemory(id: string, content: string) {
    return this.prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
      },
    });
  }

  async deleteMemory(id: string) {
    return this.prisma.memory.delete({
      where: {
        id,
      },
    });
  }
}