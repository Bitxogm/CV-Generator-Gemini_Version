import { Request, Response } from 'express';
import { GetMyProfileUseCase } from '../../../domain/use-cases/profile/GetMyProfileUseCase';
import { PrismaProfileRepository } from '../../../infrastructure/repositories/PrismaProfileRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const profileRepository = new PrismaProfileRepository(prisma);
const getMyProfileUseCase = new GetMyProfileUseCase(profileRepository);

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const result = await getMyProfileUseCase.execute(req.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
});
