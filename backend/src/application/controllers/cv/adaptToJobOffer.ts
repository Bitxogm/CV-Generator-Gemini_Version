import { Request, Response } from 'express';
import { AdaptToJobOfferUseCase } from '../../../domain/use-cases/cv/AdaptToJobOfferUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { BadRequestError, UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const geminiService = new GeminiService();
const adaptToJobOfferUseCase = new AdaptToJobOfferUseCase(cvRepository, geminiService);

export const adaptToJobOffer = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const id = req.params.id as string;
  const { jobOffer } = req.body;

  if (!jobOffer) {
    throw new BadRequestError('jobOffer es requerido');
  }

  const result = await adaptToJobOfferUseCase.execute({
    cvId: id,
    userId: req.userId,
    jobOffer,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
