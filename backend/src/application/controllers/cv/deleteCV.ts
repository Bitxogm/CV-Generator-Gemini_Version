import { Request, Response } from 'express';
import { DeleteCVUseCase } from '../../../domain/use-cases/cv/DeleteCVUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const deleteCVUseCase = new DeleteCVUseCase(cvRepository);

export const deleteCV = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const id = req.params.id as string;

  await deleteCVUseCase.execute(id, req.userId);

  res.status(200).json({
    success: true,
    message: 'CV eliminado exitosamente',
  });
});
