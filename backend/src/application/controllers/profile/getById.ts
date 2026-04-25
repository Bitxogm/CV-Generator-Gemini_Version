import { Request, Response } from 'express';
import { GetProfileUseCase } from '../../../domain/use-cases/profile/GetProfileUseCase';
import { PrismaProfileRepository } from '../../../infrastructure/repositories/PrismaProfileRepository';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const profileRepository = new PrismaProfileRepository(prisma);
const getProfileUseCase = new GetProfileUseCase(profileRepository);

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    throw new BadRequestError('ID de perfil requerido');
  }

  const result = await getProfileUseCase.execute(id);

  res.status(200).json({
    success: true,
    data: result,
  });
});
