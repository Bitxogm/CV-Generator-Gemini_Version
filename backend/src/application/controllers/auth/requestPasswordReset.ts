import { Request, Response } from 'express';
import { RecoverPasswordUseCase } from '../../../domain/use-cases/auth/RecoverPasswordUseCase';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { JWTService } from '../../../infrastructure/services/JWTService';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const userRepository = new PrismaUserRepository(prisma);
const jwtService = new JWTService();
const recoverPasswordUseCase = new RecoverPasswordUseCase(userRepository, jwtService);

export const requestPasswordReset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError('Email es requerido');
  }

  const result = await recoverPasswordUseCase.requestPasswordReset({ email });

  res.status(200).json({
    success: true,
    data: result,
  });
});
