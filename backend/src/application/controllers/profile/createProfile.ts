import { Request, Response } from 'express';
import { CreateProfileUseCase } from '../../../domain/use-cases/profile/CreateProfileUseCase';
import { PrismaProfileRepository } from '../../../infrastructure/repositories/PrismaProfileRepository';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const profileRepository = new PrismaProfileRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const createProfileUseCase = new CreateProfileUseCase(profileRepository, userRepository);

export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const { fullName, title, summary, phone, website, linkedin, github, skills } = req.body;

  const result = await createProfileUseCase.execute({
    userId: req.userId,
    fullName,
    title,
    summary,
    phone,
    website,
    linkedin,
    github,
    skills,
  });

  res.status(201).json({
    success: true,
    data: result,
  });
});
