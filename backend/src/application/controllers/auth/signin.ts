import { Request, Response } from 'express';
import { SignInUseCase } from '../../../domain/use-cases/auth/SignInUseCase';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { JWTService } from '../../../infrastructure/services/JWTService';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const userRepository = new PrismaUserRepository(prisma);
const jwtService = new JWTService();
const signInUseCase = new SignInUseCase(userRepository, jwtService);

export const signin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email y password son requeridos');
  }

  const result = await signInUseCase.execute({ email, password });

  res.status(200).json({
    success: true,
    data: result,
  });
});
