import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async chat(message: string) {
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2:1b',
          prompt: message,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }

      const data = await response.json();

      return {
        reply: data.response,
      };
    } catch (error) {
      return {
        reply:
          'JARVIS local AI is not available right now. Please make sure Ollama is running on localhost:11434.',
      };
    }
  }
}