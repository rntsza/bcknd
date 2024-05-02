import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
const saltRounds = 10;

class Advogado {
  static async find(req: Request): Promise<Omit<Advogado, 'password'>[]> {
    const advogados = await req.prisma.advogado.findMany({
      where: { isActive: true },
    });

    return advogados.map(advogado => {
      const {
        password,
        role,
        nascimento,
        createdAt,
        isActive,
        ...advogadoWithInterceptor
      } = advogado;
      return advogadoWithInterceptor;
    });
  }

  static async getAll(req: Request, res: Response) {
    try {
      const advogados = await Advogado.find(req);
      res.json(advogados);
    } catch (error) {
      console.error('Error fetching advogados:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const advogado = await req.prisma.advogado.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      if (advogado) {
        res.json(advogado);
      } else {
        res.status(404).json({ error: 'Advogado not found' });
      }
    } catch (error) {
      console.error('Error fetching advogado by id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { nome, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const isValid = await req.prisma.advogado.findFirst({
        where: {
          email: email,
        },
      });
      if (isValid)
        return res.status(401).json({ error: 'Email already exists' });

      const newAdvogado = await req.prisma.advogado.create({
        data: {
          nome,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json(newAdvogado);
    } catch (error) {
      console.error('Error creating advogado:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const updatedAdvogado = await req.prisma.advogado.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nome,
          email,
          password: hashedPassword,
        },
      });
      res.json(updatedAdvogado);
    } catch (error) {
      console.error('Error updating advogado:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // await req.prisma.advogado.delete({
      //   where: {
      //     id: parseInt(id),
      //   },
      // });
      await req.prisma.advogado.update({
        where: { id: parseInt(id) },
        data: { isActive: false },
      });
      res.json({ message: 'Advogado deleted successfully' });
    } catch (error) {
      console.error('Error deleting advogado:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default Advogado;
