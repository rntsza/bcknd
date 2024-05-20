import express, { Express } from 'express';
import routes from './routes';
import { prismaMiddleware } from './middlewares/prismaMiddleware';
// import ensureAuthenticated from './middlewares/ensureAuthenticated';
import cors from 'cors';
import { getIp } from './services/IpApi';


const allowedOrigins : string[] = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://google.com',
  '*'
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    console.log('Origin', origin);
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const app: Express = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(prismaMiddleware);
app.use(cors(corsOptions));
app.use(routes);
app.get('/ip', getIp);

// app.use(ensureAuthenticated);

app.listen(port, () => {
  console.log(`[server]: 👀 Server is running at http://localhost:${port} 👀`);
});
