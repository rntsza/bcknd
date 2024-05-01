import express, { Express, Request, Response } from 'express';
import routes from './routes';

const app: Express = express();
const port = process.env.PORT || 3333;
app.use(routes);
app.use(express.json());

app.listen(port, () => {
  console.log(`[server]: 👀 Server is running at http://localhost:${port} 👀`);
});
