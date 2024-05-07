import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';
import authConfig from '../config/auth';

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

    if (!advogado) throw new Error('Email/Senha incorretos');

    const passwordMatched = await compare(password, advogado.password);

    if (!passwordMatched) throw new Error('Email/Senha incorretos');

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
