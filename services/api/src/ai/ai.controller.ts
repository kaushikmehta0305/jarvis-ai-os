import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('chat')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post()
  chat(@Body('message') message: string) {
    return this.aiService.chat(message);
  }
}