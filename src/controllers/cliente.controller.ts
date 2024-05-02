import { Request, Response } from 'express';

class Cliente {
  static async getAll(req: Request, res: Response) {
    try {
      const users = await req.prisma.cliente.findMany({
        where: { isActive: true },
      });
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const cliente = await req.prisma.cliente.findUnique({
        where: { id: parseInt(id) },
      });
      if (cliente) {
        res.json(cliente);
      } else {
        res.status(404).json({ error: 'cliente not found' });
      }
    } catch (error) {
      console.error('Error fetching cliente by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { nome, advogadoId } = req.body;

      const newAdvogado = await req.prisma.advogado.findUnique({
        where: { id: parseInt(advogadoId) },
      });
      if (!newAdvogado) {
        return res.status(404).json({ error: 'Advogado not found' });
      }

      const newUser = await req.prisma.cliente.create({
        data: {
          nome,
          advogado: {
            connect: { id: parseInt(advogadoId) },
          },
        },
      });
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating cliente:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      const updatedUser = await req.prisma.cliente.update({
        where: { id: parseInt(id) },
        data: { nome },
      });
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating cliente:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // await req.prisma.cliente.delete({ where: { id: parseInt(id) } });
      await req.prisma.cliente.update({
        where: { id: parseInt(id) },
        data: { isActive: false }
    });
      res.json({ message: 'cliente deleted successfully' });
    } catch (error) {
      console.error('Error deleting cliente:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default Cliente;
