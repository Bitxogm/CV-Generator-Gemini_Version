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

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new BadRequestError('Token y nueva contraseña son requeridos');
  }

  const result = await recoverPasswordUseCase.resetPassword({ token, newPassword });

  res.status(200).json({
    success: true,
    data: result,
  });
});
