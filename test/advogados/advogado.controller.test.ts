import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Advogado from '../../src/controllers/advogado.controller';
import UpdateUserAvatarService from '../../src/services/UpdateUserAvatarService';

describe('Advogado Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      },
      params: { id: '1' },
      prisma
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
  });

  // Teste para o método getAll
  // describe('getAll', () => {
  //   it('deve retornar uma lista de advogados ativos', async () => {
  //     const advogadosMock = [
  //       { id: 1, nome: 'Advogado 1', email: 'adv1@test.com' },
  //       { id: 2, nome: 'Advogado 2', email: 'adv2@test.com' }
  //     ];

  //     vi.spyOn(prisma.advogado, 'findMany').mockResolvedValue(advogadosMock);

  //     await Advogado.getAll(req as Request, res as Response);

  //     expect(prisma.advogado.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
  //     expect(res.json).toHaveBeenCalledWith(advogadosMock);
  //   });

  //   it('deve retornar um erro ao falhar na busca', async () => {
  //     vi.spyOn(prisma.advogado, 'findMany').mockRejectedValue(new Error('Erro interno'));

  //     await Advogado.getAll(req as Request, res as Response);

  //     expect(prisma.advogado.findMany).toHaveBeenCalled(); // Verifica se o método foi chamado
  //     expect(res.status).toHaveBeenCalledWith(500);
  //     expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 'Erro buscando advogados:': expect.any(Error) }));
  //   });
  // });

  // Teste para o método findById
  describe('findById', () => {
    // it('deve retornar um advogado pelo id', async () => {
    //   const advogadoMock = { id: 1, nome: 'Advogado 1', email: 'adv1@test.com' };

    //   vi.spyOn(prisma.advogado, 'findUnique').mockResolvedValue(advogadoMock);

    //   await Advogado.findById(req as Request, res as Response);

    //   expect(prisma.advogado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    //   expect(res.json).toHaveBeenCalledWith(expect.objectContaining(advogadoMock));
    // });

    it('deve retornar 404 se o advogado não for encontrado', async () => {
      vi.spyOn(prisma.advogado, 'findUnique').mockResolvedValue(null);

      await Advogado.findById(req as Request, res as Response);

      expect(prisma.advogado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Advogado não encontrado' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.advogado, 'findUnique').mockRejectedValue(new Error('Erro interno'));

      await Advogado.findById(req as Request, res as Response);

      expect(prisma.advogado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método create
  describe('create', () => {
    it('deve criar um advogado com sucesso', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      vi.spyOn(prisma.advogado, 'findFirst').mockResolvedValue(null);
      vi.spyOn(prisma.advogado, 'create').mockResolvedValue({
        userId: 'uuid',
        nome: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });

      await Advogado.create(req as Request, res as Response);

      expect(prisma.advogado.findFirst).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(prisma.advogado.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Test User',
        email: 'test@example.com'
      }));
    });

    it('deve retornar 401 se o email já existir', async () => {
      vi.spyOn(prisma.advogado, 'findFirst').mockResolvedValue({ email: 'test@example.com' });

      await Advogado.create(req as Request, res as Response);

      expect(prisma.advogado.findFirst).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'O email já existe' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      vi.spyOn(prisma.advogado, 'create').mockRejectedValue(new Error('Erro interno'));

      await Advogado.create(req as Request, res as Response);

      expect(prisma.advogado.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método update
  describe('update', () => {
    // it('deve atualizar um advogado com sucesso', async () => {
    //   req.body = { nome: 'Novo Nome', email: 'novoemail@test.com', password: 'newpassword' }; // Adicionar dados ao req.body
    //   const hashedPassword = await bcrypt.hash('newpassword', 10);
    //   const updatedAdvogado = { id: 1, nome: 'Novo Nome', email: 'novoemail@test.com', password: hashedPassword };

    //   vi.spyOn(prisma.advogado, 'update').mockResolvedValue(updatedAdvogado);

    //   await Advogado.update(req as Request, res as Response);

    //   expect(prisma.advogado.update).toHaveBeenCalledWith({
    //     where: { id: 1 },
    //     data: { nome: 'Novo Nome', email: 'novoemail@test.com', password: hashedPassword }
    //   });
    //   expect(res.json).toHaveBeenCalledWith(updatedAdvogado);
    // });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.advogado, 'update').mockRejectedValue(new Error('Erro interno'));

      await Advogado.update(req as Request, res as Response);

      expect(prisma.advogado.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método delete
  describe('delete', () => {
    it('deve desativar um advogado com sucesso', async () => {
      vi.spyOn(prisma.advogado, 'update').mockResolvedValue({ id: 1, isActive: false });

      await Advogado.delete(req as Request, res as Response);

      expect(prisma.advogado.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { isActive: false } });
      expect(res.json).toHaveBeenCalledWith({ message: 'Advogado desabilitado com sucesso' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.advogado, 'update').mockRejectedValue(new Error('Erro interno'));

      await Advogado.delete(req as Request, res as Response);

      expect(prisma.advogado.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método avatar
  // describe('avatar', () => {
  //   beforeEach(() => {
  //     req.user = { id: '1' }; // Adicione o ID do usuário autenticado aqui
  //     req.file = { filename: 'avatar.png' };
  //   });

    // it('deve atualizar o avatar do advogado', async () => {
    //   const updateUserAvatar = {
    //     execute: vi.fn().mockResolvedValue({ userId: '1', avatarFilename: 'avatar.png' })
    //   };

    //   vi.spyOn(UpdateUserAvatarService.prototype, 'execute').mockReturnValue(updateUserAvatar.execute);

    //   await Advogado.avatar(req as Request, res as Response);

    //   expect(updateUserAvatar.execute).toHaveBeenCalledWith({ userId: '1', avatarFilename: 'avatar.png' });
    //   expect(res.json).toHaveBeenCalledWith(updateUserAvatar.execute);
    // });

    // it('deve retornar 500 em caso de erro', async () => {
    //   const updateUserAvatar = {
    //     execute: vi.fn().mockRejectedValue(new Error('Erro interno'))
    //   };

    //   vi.spyOn(UpdateUserAvatarService.prototype, 'execute').mockReturnValue(updateUserAvatar.execute);

    //   await Advogado.avatar(req as Request, res as Response);

    //   expect(updateUserAvatar.execute).toHaveBeenCalledWith({ userId: '1', avatarFilename: 'avatar.png' });
    //   expect(res.status).toHaveBeenCalledWith(500);
    //   expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    // });
  // });
});
