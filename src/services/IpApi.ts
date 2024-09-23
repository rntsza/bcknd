import { Request, Response, NextFunction } from 'express';

export const getIp = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log(`IP Address: ${ip}`);
  console.log(`Request IP: ${req.socket.remoteAddress}`);
  console.log(`Request IP: ${req.headers['x-forwarded-for']}`);
  if (next) {
    next();
  } else {
    res.json({ ip });
  }
};