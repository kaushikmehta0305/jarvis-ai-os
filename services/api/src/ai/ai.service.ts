import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly systemPrompt = `
You are JARVIS, Sameer's personal AI assistant.

Rules:
- Be helpful, clear, and practical.
- Keep answers concise unless the user asks for details.
- Reply in the same language style as the user.
- If the user writes in Hinglish, reply in Hinglish.
- Do not claim that you remember past conversations unless memory is provided.
- Do not say you are OpenAI or ChatGPT.
- You are running as a local AI assistant inside the JARVIS AI OS project.
`;

  async chat(message: string) {
    try {
      const prompt = `${this.systemPrompt}

User message:
${message}

JARVIS response:
`;

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2:1b',
          prompt,
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
          'Unable to connect to JARVIS. Please make sure backend is running on port 3000 and Ollama is running on port 11434.',
      };
    }
  }
}