import { Request, Response } from 'express';
import { SignUpUseCase } from '../../../domain/use-cases/auth/SignUpUseCase';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { JWTService } from '../../../infrastructure/services/JWTService';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const userRepository = new PrismaUserRepository(prisma);
const jwtService = new JWTService();
const signUpUseCase = new SignUpUseCase(userRepository, jwtService);
const emailService = new EmailService();

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    throw new BadRequestError('Email, username y password son requeridos');
  }

  const result = await signUpUseCase.execute({ email, username, password });

  try {
    await emailService.sendWelcomeEmail(email, username);
    console.log(`✅ Email de bienvenida enviado a: ${email}`);
  } catch (emailError) {
    console.error('⚠️ Error enviando email de bienvenida:', emailError);
  }

  res.status(201).json({
    success: true,
    data: result,
  });
});
