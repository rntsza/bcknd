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
class Modelo {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modelos = yield req.prisma.modeloTexto.findMany({
                    include: {
                        tags: true,
                        advogado: true,
                    },
                });
                res.json(modelos);
            }
            catch (error) {
                console.error('Error fetching modelos:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const modelo = yield req.prisma.modeloTexto.findUnique({
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
            }
            catch (error) {
                console.error('Error fetching modelo by ID:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { titulo, texto, tags, advogadoId } = req.body;
                const modelo = yield req.prisma.modeloTexto.create({
                    data: {
                        titulo,
                        texto,
                        tags: {
                            connect: tags.map((tagId) => ({ id: tagId })),
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
            }
            catch (error) {
                console.error('Error creating modelo:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { titulo, texto, tags, advogadoId } = req.body;
                const modelo = yield req.prisma.modeloTexto.update({
                    where: { id: parseInt(id) },
                    data: {
                        titulo,
                        texto,
                        tags: {
                            set: tags.map((tagId) => ({ id: tagId })),
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
            }
            catch (error) {
                console.error('Error updating modelo:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield req.prisma.modeloTexto.update({
                    where: { id: parseInt(id) },
                    data: { isActive: false },
                });
                res.json({ message: 'Modelo deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting modelo:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = Modelo;
