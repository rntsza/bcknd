import express, { Express} from 'express';
import routes from './routes';
import { prismaMiddleware } from '../prisma/prismaMiddleware';

const app: Express = express();
const port = process.env.PORT || 3333;
app.use(express.json());
app.use(prismaMiddleware);
app.use(routes);


app.listen(port, () => {
  console.log(`[server]: 👀 Server is running at http://localhost:${port} 👀`);
});
