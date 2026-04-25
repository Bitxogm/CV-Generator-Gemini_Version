import { Request, Response } from 'express';
import { GetMyCVsUseCase } from '../../../domain/use-cases/cv/GetMyCVsUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { UnauthorizedError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const getMyCVsUseCase = new GetMyCVsUseCase(cvRepository);

export const getMyCVs = asyncHandler(async (req: Request, res: Response) => {
  if (!req.userId) {
    throw new UnauthorizedError('Usuario no autenticado');
  }

  const { hasJobOffer, search, limit, offset, sortBy, sortOrder } = req.query;

  const result = await getMyCVsUseCase.execute(req.userId, {
    hasJobOffer: hasJobOffer === 'true',
    search: search as string,
    limit: limit ? parseInt(limit as string) : undefined,
    offset: offset ? parseInt(offset as string) : undefined,
    sortBy: sortBy as 'createdAt' | 'updatedAt',
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  res.status(200).json({
    success: true,
    data: result,
  });
});
