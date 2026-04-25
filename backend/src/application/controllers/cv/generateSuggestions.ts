import { Request, Response } from 'express';
import { GenerateSuggestionsUseCase } from '../../../domain/use-cases/cv/GenerateSuggestionsUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { GeminiService } from '../../../infrastructure/services/GeminiService';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const geminiService = new GeminiService();
const generateSuggestionsUseCase = new GenerateSuggestionsUseCase(cvRepository, geminiService);

export const generateSuggestions = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const result = await generateSuggestionsUseCase.execute(id);

  res.status(200).json({
    success: true,
    data: result,
  });
});
