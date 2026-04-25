import { Request, Response } from 'express';
import { GenerateCoverLetterUseCase } from '../../../domain/use-cases/cv/GenerateCoverLetterUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const geminiService = new GeminiService();
const generateCoverLetterUseCase = new GenerateCoverLetterUseCase(cvRepository, geminiService);

export const generateCoverLetter = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { jobOffer } = req.body;

  if (!jobOffer) {
    throw new BadRequestError('jobOffer es requerido');
  }

  const result = await generateCoverLetterUseCase.execute({
    cvId: id,
    userId: req.userId!,
    jobOffer,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
