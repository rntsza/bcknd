import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  
  console.log(`Passando pelo Middleware 🐱‍👤🐱‍🐉🐱‍💻🐱‍👓🐱‍🚀 - Method: ${req.method} Endpoint: ${req.url} `)
  req.prisma = prisma;
  next();
};
