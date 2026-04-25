import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404);
  next(error);
};
