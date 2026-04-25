import { Request, Response } from 'express';
import { UpdateCVUseCase } from '../../../domain/use-cases/cv/UpdateCVUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const updateCVUseCase = new UpdateCVUseCase(cvRepository);

export const updateCV = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const id = req.params.id as string;
  const { title, cvData, jobOffer, coverLetter, pdfUrl } = req.body;

  const result = await updateCVUseCase.execute({
    cvId: id,
    userId: req.userId,
    title,
    cvData,
    jobOffer,
    coverLetter,
    pdfUrl,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
