"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var Tipo;
(function (Tipo) {
    Tipo["FISICA"] = "FISICA";
    Tipo["JURIDICA"] = "JURIDICA";
})(Tipo || (Tipo = {}));
class Cliente {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield req.prisma.cliente.findMany({
                    where: { isActive: true },
                });
                res.json(users);
            }
            catch (error) {
                console.error('Error fetching users:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const cliente = yield req.prisma.cliente.findUnique({
                    where: { id: parseInt(id) },
                });
                if (cliente) {
                    res.json(cliente);
                }
                else {
                    res.status(404).json({ error: 'cliente not found' });
                }
            }
            catch (error) {
                console.error('Error fetching cliente by id:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, advogadoId } = req.body;
                const newAdvogado = yield req.prisma.advogado.findUnique({
                    where: { id: parseInt(advogadoId) },
                });
                if (!newAdvogado) {
                    return res.status(404).json({ error: 'Advogado not found' });
                }
                const newUser = yield req.prisma.cliente.create({
                    data: {
                        nome,
                        advogado: {
                            connect: { id: parseInt(advogadoId) },
                        },
                    },
                });
                res.status(201).json(newUser);
            }
            catch (error) {
                console.error('Error creating cliente:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome } = req.body;
                const updatedUser = yield req.prisma.cliente.update({
                    where: { id: parseInt(id) },
                    data: { nome },
                });
                res.json(updatedUser);
            }
            catch (error) {
                console.error('Error updating cliente:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // await req.prisma.cliente.delete({ where: { id: parseInt(id) } });
                yield req.prisma.cliente.update({
                    where: { id: parseInt(id) },
                    data: { isActive: false }
                });
                res.json({ message: 'cliente deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting cliente:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = Cliente;
