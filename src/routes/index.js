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
const advogado_controller_1 = __importDefault(require("../controllers/advogado.controller"));
const cliente_controller_1 = __importDefault(require("../controllers/cliente.controller"));
const modelo_controller_1 = __importDefault(require("../controllers/modelo.controller"));
const tag_controller_1 = __importDefault(require("../controllers/tag.controller"));
const sessions_controller_1 = __importDefault(require("../controllers/sessions.controller"));
const multer_1 = __importDefault(require("multer"));
const upload_1 = __importDefault(require("../config/upload"));
const upload = (0, multer_1.default)(upload_1.default);
// import ensureAuthenticated from '../middlewares/ensureAuthenticated';
const routes = (0, express_1.Router)();
const getPgVersion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const version = yield req.prisma.$queryRaw `select version()`;
        if (version)
            return `Online 🚀`;
    }
    catch (error) {
        console.error('Error connecting to PostgreSQL:', error);
        return 'Offline ❌';
    }
});
routes.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield getPgVersion(req, res);
    res.send(`Express + TypeScript Server + PG Database: ${status}`);
}));
// Rotas de advogados
routes.get('/advogados', advogado_controller_1.default.getAll);
routes.get('/advogados/:id', advogado_controller_1.default.findById);
routes.post('/advogados', advogado_controller_1.default.create);
routes.put('/advogados/:id', advogado_controller_1.default.update);
routes.delete('/advogados/:id', advogado_controller_1.default.delete);
routes.patch('/advogados/avatar', upload.single('avatar'), advogado_controller_1.default.avatar);
// Rotas de usuários
routes.get('/clientes', cliente_controller_1.default.getAll);
routes.get('/clientes/:id', cliente_controller_1.default.findById);
routes.post('/clientes', cliente_controller_1.default.create);
routes.put('/clientes/:id', cliente_controller_1.default.update);
routes.delete('/clientes/:id', cliente_controller_1.default.delete);
// routes.patch('/clientes/avatar', Cliente.patch);
// Rotas de modelos
routes.get('/modelos', modelo_controller_1.default.getAll);
routes.get('/modelos/:id', modelo_controller_1.default.findById);
routes.post('/modelos', modelo_controller_1.default.create);
routes.put('/modelos/:id', modelo_controller_1.default.update);
routes.delete('/modelos/:id', modelo_controller_1.default.delete);
// Rotas de tags
routes.get('/tags', tag_controller_1.default.getAll);
routes.get('/tags/:id', tag_controller_1.default.findById);
routes.post('/tags', tag_controller_1.default.create);
routes.put('/tags/:id', tag_controller_1.default.update);
routes.delete('/tags/:id', tag_controller_1.default.delete);
// Rotas de AI
// routes.post('/openai', OpenAIsvc.generateText);
// Rota de sessão
// routes.use('/sessions', cors(corsOptions), sessionsRouter);
routes.use('/sessions', sessions_controller_1.default);
//
exports.default = routes;
