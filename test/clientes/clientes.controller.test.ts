import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Cliente from '../../src/controllers/cliente.controller';

describe('Cliente Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let prisma: PrismaClient;

  beforeEach(() => {
    prisma = new PrismaClient();
    req = {
      body: {
        nome: 'Test Cliente',
        advogadoId: '1'
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
  describe('getAll', () => {
    it('deve retornar uma lista de clientes ativos', async () => {
      const clientesMock = [
        { id: 1, nome: 'Cliente 1', isActive: true },
        { id: 2, nome: 'Cliente 2', isActive: true }
      ];

      vi.spyOn(prisma.cliente, 'findMany').mockResolvedValue(clientesMock);

      await Cliente.getAll(req as Request, res as Response);

      expect(prisma.cliente.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
      expect(res.json).toHaveBeenCalledWith(clientesMock);
    });

    it('deve retornar um erro ao falhar na busca', async () => {
      vi.spyOn(prisma.cliente, 'findMany').mockRejectedValue(new Error('Erro interno'));

      await Cliente.getAll(req as Request, res as Response);

      expect(prisma.cliente.findMany).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método findById
  describe('findById', () => {
    it('deve retornar um cliente pelo id', async () => {
      const clienteMock = { id: 1, nome: 'Cliente 1' };

      vi.spyOn(prisma.cliente, 'findUnique').mockResolvedValue(clienteMock);

      await Cliente.findById(req as Request, res as Response);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.json).toHaveBeenCalledWith(clienteMock);
    });

    it('deve retornar 404 se o cliente não for encontrado', async () => {
      vi.spyOn(prisma.cliente, 'findUnique').mockResolvedValue(null);

      await Cliente.findById(req as Request, res as Response);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'cliente not found' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.cliente, 'findUnique').mockRejectedValue(new Error('Erro interno'));

      await Cliente.findById(req as Request, res as Response);

      expect(prisma.cliente.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método create
  describe('create', () => {
    it('deve criar um cliente com sucesso', async () => {
      const advogadoMock = { id: 1, nome: 'Advogado 1' };
      vi.spyOn(prisma.advogado, 'findUnique').mockResolvedValue(advogadoMock);

      const clienteMock = {
        id: 1,
        nome: 'Test Cliente',
        advogado: advogadoMock
      };

      vi.spyOn(prisma.cliente, 'create').mockResolvedValue(clienteMock);

      await Cliente.create(req as Request, res as Response);

      expect(prisma.advogado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.cliente.create).toHaveBeenCalledWith({
        data: {
          nome: 'Test Cliente',
          advogado: {
            connect: { id: 1 }
          }
        }
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(clienteMock);
    });

    it('deve retornar 404 se o advogado não for encontrado', async () => {
      vi.spyOn(prisma.advogado, 'findUnique').mockResolvedValue(null);

      await Cliente.create(req as Request, res as Response);

      expect(prisma.advogado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Advogado not found' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.advogado, 'findUnique').mockRejectedValue(new Error('Erro interno'));

      await Cliente.create(req as Request, res as Response);

      expect(prisma.advogado.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método update
  describe('update', () => {
    it('deve atualizar um cliente com sucesso', async () => {
      req.body = { nome: 'Nome Atualizado' };
      const clienteAtualizado = { id: 1, nome: 'Nome Atualizado' };

      vi.spyOn(prisma.cliente, 'update').mockResolvedValue(clienteAtualizado);

      await Cliente.update(req as Request, res as Response);

      expect(prisma.cliente.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: 'Nome Atualizado' }
      });
      expect(res.json).toHaveBeenCalledWith(clienteAtualizado);
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.cliente, 'update').mockRejectedValue(new Error('Erro interno'));

      await Cliente.update(req as Request, res as Response);

      expect(prisma.cliente.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { nome: req.body?.nome }
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  // Teste para o método delete
  describe('delete', () => {
    it('deve desativar um cliente com sucesso', async () => {
      vi.spyOn(prisma.cliente, 'update').mockResolvedValue({ id: 1, isActive: false });

      await Cliente.delete(req as Request, res as Response);

      expect(prisma.cliente.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { isActive: false } });
      expect(res.json).toHaveBeenCalledWith({ message: 'cliente deleted successfully' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      vi.spyOn(prisma.cliente, 'update').mockRejectedValue(new Error('Erro interno'));

      await Cliente.delete(req as Request, res as Response);

      expect(prisma.cliente.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { isActive: false } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
