import { Request, Response } from 'express';
import { GenerateSuggestionsUseCase } from '../../../domain/use-cases/cv/GenerateSuggestionsUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const geminiService = new GeminiService();
const generateSuggestionsUseCase = new GenerateSuggestionsUseCase(cvRepository, geminiService);

export const generateSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const result = await generateSuggestionsUseCase.execute({ cvId: id, userId: req.userId });

  res.status(200).json({
    success: true,
    data: result,
  });
});
