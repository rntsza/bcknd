import { Router } from 'express';
import { Request, Response } from 'express';
import Advogado from '../controllers/advogado.controller';
import Cliente from '../controllers/cliente.controller';
import Modelo from '../controllers/modelo.controller';
import Tag from '../controllers/tag.controller';

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});

routes.get('/teste', async (req: Request, res: Response) => {
  const advogados = await req.prisma.advogado.findMany();
  res.send(`"Express + TypeScript Server" = ${advogados}`);
});

// Rotas de advogados

routes.get('/advogados', Advogado.getAll);
routes.get('/advogados/:id', Advogado.findById);
routes.post('/advogados', Advogado.create);
routes.put('/advogados/:id', Advogado.update);
routes.delete('/advogados/:id', Advogado.delete);

// Rotas de usuários
routes.get('/clientes', Cliente.getAll);
routes.get('/clientes/:id', Cliente.findById);
routes.post('/clientes', Cliente.create);
routes.put('/clientes/:id', Cliente.update);
routes.delete('/clientes/:id', Cliente.delete);

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

export default routes;
