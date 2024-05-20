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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const uuid_1 = require("uuid");
const ensureAuthenticated_1 = __importDefault(require("../middlewares/ensureAuthenticated"));
const UpdateUserAvatarService_1 = __importDefault(require("../services/UpdateUserAvatarService"));
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
})(Role || (Role = {}));
class Advogado {
    static interceptor(advogados) {
        if (Array.isArray(advogados)) {
            return advogados.map(advogado => {
                const { password, nascimento, role, updateAt, isActive, id } = advogado, advogadoWithInterceptor = __rest(advogado, ["password", "nascimento", "role", "updateAt", "isActive", "id"]);
                return advogadoWithInterceptor;
            });
        }
        else {
            const { password, nascimento, role, updateAt, isActive, id } = advogados, advogadoWithInterceptor = __rest(advogados, ["password", "nascimento", "role", "updateAt", "isActive", "id"]);
            return advogadoWithInterceptor;
        }
    }
    static getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, ensureAuthenticated_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const advogados = yield req.prisma.advogado.findMany({
                            where: { isActive: true },
                        });
                        const interceptor = Advogado.interceptor(advogados);
                        res.json(interceptor);
                    }
                    catch (error) {
                        res.status(500).json({ 'Erro buscando advogados:': error });
                    }
                }));
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        });
    }
    static findById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const advogado = yield req.prisma.advogado.findUnique({
                    where: {
                        id: parseInt(id),
                    },
                });
                if (advogado) {
                    const interceptor = Advogado.interceptor(advogado);
                    res.json(interceptor);
                }
                else {
                    res.status(404).json({ error: 'Advogado não encontrado' });
                }
            }
            catch (error) {
                console.error('Erro buscando advogado por id:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('advogado create:', req.body);
            // console.log('Ip?:', getIp)
            // console.log('ip2?', req.headers['x-forwarded-for'] || req.socket.remoteAddress)
            // console.log('ip3?', req.headers['x-forwarded-for'])
            // console.log('ip4?', req.socket.remoteAddress)
            // console.log('ip5?', req.headers)
            // console.log('ip6?', req.socket.remoteAddress)
            try {
                const { name, email, password } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const isValid = yield req.prisma.advogado.findFirst({
                    where: {
                        email: email,
                    },
                });
                if (isValid)
                    return res.status(401).json({ error: 'O email já existe' });
                const newAdvogado = yield req.prisma.advogado.create({
                    data: {
                        userId: (0, uuid_1.v4)(),
                        nome: name,
                        email,
                        password: hashedPassword,
                    },
                });
                const interceptor = Advogado.interceptor(newAdvogado);
                res.status(201).json(interceptor);
                // res.status(201).json(newAdvogado);
            }
            catch (error) {
                console.error('Erro criando advogado:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, email, password } = req.body;
                const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
                const updatedAdvogado = yield req.prisma.advogado.update({
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
            }
            catch (error) {
                console.error('Erro atualizando advogado:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static avatar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                (0, ensureAuthenticated_1.default)(req, res, () => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    try {
                        const updateUserAvatar = new UpdateUserAvatarService_1.default();
                        yield updateUserAvatar.execute({
                            userId: req.user.id,
                            avatarFilename: ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) || '',
                        });
                        return res.json(updateUserAvatar);
                    }
                    catch (error) {
                        res.status(500).json({ error: 'Internal server error' });
                    }
                }));
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                // await req.prisma.advogado.delete({
                //   where: {
                //     id: parseInt(id),
                //   },
                // });
                yield req.prisma.advogado.update({
                    where: { id: parseInt(id) },
                    data: { isActive: false },
                });
                res.json({ message: 'Advogado desabilitado com sucesso' });
            }
            catch (error) {
                console.error('Erro deletando advogado:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}
exports.default = Advogado;
