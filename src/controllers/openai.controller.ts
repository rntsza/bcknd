import { Request, Response } from 'express';
import { processQuestion } from '../services/openAIApiService';

class OpenAIController {
  static async generateText(req: Request, res: Response) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      const response = await processQuestion({ content });
      return res.json({ response });
    } catch (error) {
      console.error('Error processing OpenAI request:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default OpenAIController;
