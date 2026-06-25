import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MemoryService } from './memory.service';

@Controller('memory')
export class MemoryController {
  constructor(private memoryService: MemoryService) {}

  @Post()
  create(@Body('content') content: string) {
    return this.memoryService.createMemory(content);
  }

  @Get()
  findAll() {
    return this.memoryService.getMemories();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memoryService.getMemoryById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('content') content: string) {
    return this.memoryService.updateMemory(id, content);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memoryService.deleteMemory(id);
  }
}