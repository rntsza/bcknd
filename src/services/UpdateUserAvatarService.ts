import { Advogado, PrismaClient } from '@prisma/client';
import path from 'path';
import uploadConfig from '../config/upload';
import fs from 'fs';
import AppError from '../errors/AppError';

const prisma = new PrismaClient();

interface Request {
  userId: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({
    userId,
    avatarFilename,
  }: Request): Promise<Advogado> {
    
    const userRepository = await prisma.advogado.findFirst({
      where: {
        userId: userId,
      },
    });

    if (!userRepository) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (userRepository.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, userRepository.avatar);
      const normalizedPath = path.resolve(userAvatarFilePath);

      // Verifica se o caminho normalizado começa com o diretório seguro
      if (!normalizedPath.startsWith(path.resolve(uploadConfig.directory))) {
        throw new AppError('Invalid file path.', 400);
      }

      try {
        await fs.promises.stat(normalizedPath);
        await fs.promises.unlink(normalizedPath);
      } catch (err) {
        // Se o arquivo não existir, não faz nada
      }
    }

    userRepository.avatar = avatarFilename;

    await prisma.advogado.update({
      where: {
        id: userRepository.id,
      },
      data: {
        avatar: avatarFilename,
      },
    });

    return userRepository;
  }
}

export default UpdateUserAvatarService;