import { Request, Response } from 'express';

export const getIp = (req: Request, res: Response): void => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(ip)
  res.json({ ip });
};
