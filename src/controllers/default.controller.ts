import { Request, Response } from 'express';
import { processQuestion } from '../services/openAIApi.services.js'

class Default {
  static async getAll(req: Request, res: Response) {
    try {
    } catch (error) {}
  }

  static async findById(req: Request, res: Response) {
    try {
    } catch (error) {}
  }

  static async create(req: Request, res: Response) {
    try {
      const resposta = await processQuestion({ content: 'Sua pergunta aqui' });
      console.log(resposta);
    } catch (error) {}
  }

  static async update(req: Request, res: Response) {
    try {
    } catch (error) {}
  }

  static async delete(req: Request, res: Response) {
    try {
    } catch (error) {}
  }
}

export default Default;
