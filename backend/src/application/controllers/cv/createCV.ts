import { Request, Response } from 'express';
import { CreateCVUseCase } from '../../../domain/use-cases/cv/CreateCVUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { PrismaUserRepository } from '../../../infrastructure/repositories/PrismaUserRepository';
import { EmailService } from '../../../infrastructure/services/EmailService';
import { BadRequestError, UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const createCVUseCase = new CreateCVUseCase(cvRepository, userRepository);
const emailService = new EmailService();

export const createCV = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const { title, cvData } = req.body;

  if (!title || !cvData) {
    throw new BadRequestError('title y cvData son requeridos');
  }

  const result = await createCVUseCase.execute({
    userId: req.userId,
    title,
    cvData,
  });

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { email: true, username: true },
    });

    if (user) {
      await emailService.sendCVCreatedEmail(user.email, user.username, title);
      console.log(`✅ Email de CV creado enviado a: ${user.email}`);
    }
  } catch (emailError) {
    console.error('⚠️ Error enviando email de CV creado:', emailError);
  }

  res.status(201).json({
    success: true,
    data: result,
  });
});
