import express, { Express } from 'express';
import routes from './routes';
import { prismaMiddleware } from './middlewares/prismaMiddleware';
// import ensureAuthenticated from './middlewares/ensureAuthenticated';

const app: Express = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(prismaMiddleware);
app.use(routes);
// app.use(ensureAuthenticated);

app.listen(port, () => {
  console.log(`[server]: 👀 Server is running at http://localhost:${port} 👀`);
});
