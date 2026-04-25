import { Request, Response } from 'express';
import { GetCVUseCase } from '../../../domain/use-cases/cv/GetCVUseCase';
import { PrismaCVRepository } from '../../../infrastructure/repositories/PrismaCVRepository';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';
import { prisma } from '../../../infrastructure/database/prisma/PrismaClient';

const cvRepository = new PrismaCVRepository(prisma);
const getCVUseCase = new GetCVUseCase(cvRepository);

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!id) {
    throw new BadRequestError('ID de CV requerido');
  }

  const result = await getCVUseCase.execute(id, req.userId);

  res.status(200).json({
    success: true,
    data: result,
  });
});
