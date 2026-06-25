import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async chat(message: string) {
    return {
      reply: `Hello, I am JARVIS. I received your message: "${message}". Real AI response will be enabled after OpenAI billing/quota is fixed.`,
    };
  }
}