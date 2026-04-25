import { Request, Response } from 'express';
import { UpdateProfileUseCase } from '../../../domain/use-cases/profile/UpdateProfileUseCase';
import { PrismaProfileRepository } from '../../../infrastructure/repositories/PrismaProfileRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const profileRepository = new PrismaProfileRepository(prisma);
const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const id = req.params.id as string;
  const { fullName, title, summary, phone, website, linkedin, github, skills, isPublic } = req.body;

  const result = await updateProfileUseCase.execute({
    profileId: id,
    userId: req.userId,
    fullName,
    title,
    summary,
    phone,
    website,
    linkedin,
    github,
    skills,
    isPublic,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
