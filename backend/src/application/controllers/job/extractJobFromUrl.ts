import { Request, Response } from 'express';
import { JobScraperService } from '../../../infrastructure/services/JobScraperService';
import { BadRequestError } from '../../../domain/errors/AppError';
import { asyncHandler } from '../../utils/asyncHandler';

const jobScraperService = new JobScraperService();

export const extractJobFromUrl = asyncHandler(async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url) {
    throw new BadRequestError('URL es requerida');
  }

  try {
    new URL(url);
  } catch {
    throw new BadRequestError('URL inválida');
  }

  const jobOffer = await jobScraperService.extractFromUrl(url);

  res.json({
    success: true,
    data: jobOffer,
  });
});
