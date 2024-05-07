import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import authConfig from '../config/auth';
import AppError from '../errors/AppError';

const prisma = new PrismaClient();

interface Advogado {
  email: string;
  password: string;
}

class AuthenticateUserService {
  public async execute({ email, password }: Advogado) {
    const advogado = await prisma.advogado.findUnique({
      where: {
        email,
      },
    });

    if (!advogado) throw new AppError('Email/Senha incorretos', 401);

    const passwordMatched = await compare(password, advogado.password);

    if (!passwordMatched) throw new AppError('Email/Senha incorretos', 401);

    const { secret, expiresIn } = authConfig.jwt;
    const token = sign(
      { name: advogado.nome, createdAt: advogado.createdAt },
      secret,
      {
        subject: advogado.userId || '',
        expiresIn: expiresIn,
      },
    );

    return { advogado, token };
  }
}

export default AuthenticateUserService;
