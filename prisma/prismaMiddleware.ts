import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '@prisma/client/edge'
// Não sei se posso usar o edge, mas vou deixar ai comentado, vai que
const prisma = new PrismaClient();

export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.prisma = prisma;
  next();
};
