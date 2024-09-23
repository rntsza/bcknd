import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
const saltRounds = 10;
import ModeloTexto from './modelo.controller';
import Cliente from './cliente.controller';
import { v4 as uuidv4 } from 'uuid';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

interface Advogado {
  id: number;
  userId: string;
  createdAt: Date;
  updateAt: Date;
  email: string;
  password: string;
  nome: string | null;
  nascimento: Date | null;
  role: Role;
  avatar: string | null;
  isActive: boolean;
  clientes: Cliente[];
  modelosTexto: ModeloTexto[];
}

enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

class Advogado {
  static interceptor(advogados: any | any[]) {
    if (Array.isArray(advogados)) {
      return advogados.map(advogado => {
        const {
          password,
          nascimento,
          role,
          updateAt,
          isActive,
          id,
          ...advogadoWithInterceptor
        } = advogado;
        return advogadoWithInterceptor;
      });
    } else {
      const {
        password,
        nascimento,
        role,
        updateAt,
        isActive,
        id,
        ...advogadoWithInterceptor
      } = advogados;
      return advogadoWithInterceptor;
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      ensureAuthenticated(req, res, async () => {
        try {
      const advogados = await req.prisma.advogado.findMany({
        where: { isActive: true },
      });
      const interceptor = Advogado.interceptor(advogados);
      res.json(interceptor);
      } catch (error) {
        res.status(500).json({ 'Erro buscando advogados:': error });
      }
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
        const interceptor = Advogado.interceptor(advogado);
        res.json(interceptor);
      } else {
        res.status(404).json({ error: 'Advogado não encontrado' });
      }
    } catch (error) {
      console.error('Erro buscando advogado por id:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const isValid = await req.prisma.advogado.findFirst({
        where: {
          email: email,
        },
      });
      if (isValid)
        return res.status(401).json({ error: 'O email já existe' });
      const newAdvogado = await req.prisma.advogado.create({
        data: {
          userId: uuidv4(),
          nome: name,
          email,
          password: hashedPassword,
        },
      });
      const interceptor = Advogado.interceptor(newAdvogado);
      res.status(201).json(interceptor);
      // res.status(201).json(newAdvogado);
    } catch (error) {
      console.error('Erro criando advogado:', error);
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
      console.error('Erro atualizando advogado:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async avatar(req: Request, res: Response) {
    try {
      ensureAuthenticated(req, res, async () => {
        try {
          const updateUserAvatar = new UpdateUserAvatarService();
          await updateUserAvatar.execute({
            userId: req.user.id,
            avatarFilename: req.file?.filename || '',
          });
          return res.json(updateUserAvatar);
        } catch (error) {
          res.status(500).json({ error: 'Internal server error' });
        }
      });
    } catch (error) {
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
      res.json({ message: 'Advogado desabilitado com sucesso' });
    } catch (error) {
      console.error('Erro deletando advogado:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default Advogado;
