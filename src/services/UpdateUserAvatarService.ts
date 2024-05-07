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
      const userAvatarFilePath = path.join(
        uploadConfig.directory,
        userRepository?.avatar,
      );
      const userAvatarFileExistis = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExistis) {
        await fs.promises.unlink(userAvatarFilePath);
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
