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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../config/auth"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const prisma = new client_1.PrismaClient();
class AuthenticateUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const advogado = yield prisma.advogado.findUnique({
                where: {
                    email,
                },
            });
            if (!advogado)
                throw new AppError_1.default('Email/Senha incorretos', 401);
            const passwordMatched = yield (0, bcrypt_1.compare)(password, advogado.password);
            if (!passwordMatched)
                throw new AppError_1.default('Email/Senha incorretos', 401);
            const { secret, expiresIn } = auth_1.default.jwt;
            const token = (0, jsonwebtoken_1.sign)({ name: advogado.nome, createdAt: advogado.createdAt }, secret, {
                subject: advogado.userId || '',
                expiresIn: expiresIn,
            });
            return { advogado, token };
        });
    }
}
exports.default = AuthenticateUserService;
