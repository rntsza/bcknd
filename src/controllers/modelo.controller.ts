import { Request, Response } from 'express';

class Modelo {
  static async getAll(req: Request, res: Response) {
    try {
      const modelos = await req.prisma.modeloTexto.findMany({
        include: {
          tags: true,
          advogado: true,
        },
      });
      res.json(modelos);
    } catch (error) {
      console.error('Error fetching modelos:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const modelo = await req.prisma.modeloTexto.findUnique({
        where: { id: parseInt(id) },
        include: {
          tags: true,
          advogado: true,
        },
      });
      if (!modelo) {
        return res.status(404).json({ error: 'Modelo not found' });
      }
      res.json(modelo);
    } catch (error) {
      console.error('Error fetching modelo by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { titulo, texto, tags, advogadoId } = req.body;
      const modelo = await req.prisma.modeloTexto.create({
        data: {
          titulo,
          texto,
          tags: {
            connect: tags.map((tagId: number) => ({ id: tagId })),
          },
          advogado: {
            connect: { id: advogadoId },
          },
        },
        include: {
          tags: true,
          advogado: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });
      res.status(201).json(modelo);
    } catch (error) {
      console.error('Error creating modelo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { titulo, texto, tags, advogadoId } = req.body;
      const modelo = await req.prisma.modeloTexto.update({
        where: { id: parseInt(id) },
        data: {
          titulo,
          texto,
          tags: {
            set: tags.map((tagId: number) => ({ id: tagId })),
          },
          advogado: {
            connect: { id: advogadoId },
          },
        },
        include: {
          tags: true,
          advogado: {
            select: {
              id: true,
              nome: true,
              email: true,
            },
          },
        },
      });
      res.json(modelo);
    } catch (error) {
      console.error('Error updating modelo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await req.prisma.modeloTexto.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
      res.json({ message: 'Modelo deleted successfully' });
    } catch (error) {
      console.error('Error deleting modelo:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default Modelo;
