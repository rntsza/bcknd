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
const express_1 = require("express");
const AuhenticateUserService_1 = __importDefault(require("../services/AuhenticateUserService"));
const sessionsRouter = (0, express_1.Router)();
sessionsRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = request.body;
        console.log(request.body);
        console.log(email, password);
        const authenticateUser = new AuhenticateUserService_1.default();
        const { advogado, token } = yield authenticateUser.execute({
            email,
            password,
        });
        const { userId, nome, createdAt, email: advogadoEmail } = advogado;
        const advogadoResponse = { userId, nome, createdAt, email: advogadoEmail };
        return response.json({ advogado: advogadoResponse, token });
    }
    catch (err) {
        return response.status(err.statusCode).json({ error: err.message });
    }
}));
exports.default = sessionsRouter;
