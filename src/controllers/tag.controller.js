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
class Tag {
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tags = yield req.prisma.tag.findMany();
                res.json(tags);
            }
            catch (error) {
                console.error('Error fetching tags:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tag = yield req.prisma.tag.findUnique({
                    where: { id: parseInt(id) },
                });
                if (!tag) {
                    return res.status(404).json({ error: 'Tag not found' });
                }
                res.json(tag);
            }
            catch (error) {
                console.error('Error fetching tag by ID:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome } = req.body;
                const tag = yield req.prisma.tag.create({
                    data: {
                        nome,
                    },
                });
                res.status(201).json(tag);
            }
            catch (error) {
                console.error('Error creating tag:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome } = req.body;
                const tag = yield req.prisma.tag.update({
                    where: { id: parseInt(id) },
                    data: {
                        nome,
                    },
                });
                res.json(tag);
            }
            catch (error) {
                console.error('Error updating tag:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield req.prisma.tag.delete({
                    where: { id: parseInt(id) },
                });
                res.json({ message: 'Tag deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting tag:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = Tag;
