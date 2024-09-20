import { Router } from 'express';
import { Request, Response } from 'express';
import Advogado from '../controllers/advogado.controller';
import Cliente from '../controllers/cliente.controller';
import Modelo from '../controllers/modelo.controller';
import Tag from '../controllers/tag.controller';
import sessionsRouter from '../controllers/sessions.controller';
import multer from 'multer';
import uploadConfig from '../config/upload';
import rateLimit from 'express-rate-limit';

const upload = multer(uploadConfig);
// import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const routes = Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

routes.use(limiter);

const getPgVersion = async (req: Request, res: Response) => {
  try {
    const version = await req.prisma.$queryRaw`select version()`;
    if (version) return `Online 🚀`;
  } catch (error) {
    console.error('Error connecting to PostgreSQL:', error);
    return 'Offline ❌';
  }
};

routes.get('/', async (req: Request, res: Response) => {
  const status = await getPgVersion(req, res);
  res.send(`Express + TypeScript Server + PG Database: ${status}`);
});

// Rotas de advogados

routes.get('/advogados', Advogado.getAll);
routes.get('/advogados/:id', Advogado.findById);
routes.post('/advogados', Advogado.create);
routes.put('/advogados/:id', Advogado.update);
routes.delete('/advogados/:id', Advogado.delete);
routes.patch('/advogados/avatar', upload.single('avatar'), Advogado.avatar);

// Rotas de usuários
routes.get('/clientes', Cliente.getAll);
routes.get('/clientes/:id', Cliente.findById);
routes.post('/clientes', Cliente.create);
routes.put('/clientes/:id', Cliente.update);
routes.delete('/clientes/:id', Cliente.delete);
// routes.patch('/clientes/avatar', Cliente.patch);

// Rotas de modelos
routes.get('/modelos', Modelo.getAll);
routes.get('/modelos/:id', Modelo.findById);
routes.post('/modelos', Modelo.create);
routes.put('/modelos/:id', Modelo.update);
routes.delete('/modelos/:id', Modelo.delete);

// Rotas de tags
routes.get('/tags', Tag.getAll);
routes.get('/tags/:id', Tag.findById);
routes.post('/tags', Tag.create);
routes.put('/tags/:id', Tag.update);
routes.delete('/tags/:id', Tag.delete);

// Rotas de AI
// routes.post('/openai', OpenAIsvc.generateText);

// Rota de sessão
// routes.use('/sessions', cors(corsOptions), sessionsRouter);
routes.use('/sessions', sessionsRouter);

//

export default routes;
