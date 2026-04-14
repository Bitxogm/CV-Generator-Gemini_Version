import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../domain/errors/AppError';

/**
 * Middleware de manejo global de errores
 * Debe ir DESPUÉS de todas las rutas en server.ts
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Si ya se envió la respuesta, pasar al siguiente error handler
  if (res.headersSent) {
    return next(err);
  }

  // Determinar si es un error operacional o un bug
  const isOperational = err instanceof AppError && err.isOperational;

  // Status code por defecto
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Mensaje de error
  const message = isOperational ? err.message : 'Error interno del servidor';

  // Log del error
  if (!isOperational) {
    // Errores no controlados (bugs) - log completo
    console.error('🔴 ERROR NO CONTROLADO:', err);
  } else {
    // Errores operacionales - log simple
    console.log(`⚠️  [${statusCode}] ${message}`);
  }

  // Respuesta al cliente
  const response: any = {
    success: false,
    error: {
      statusCode,
      message,
    },
  };

  // En desarrollo, incluir stack trace y detalles
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    if (err instanceof AppError && err.details) {
      response.error.details = err.details;
    }
  }

  res.status(statusCode).json(response);
};

/**
 * Middleware para capturar errores asíncronos
 * Wrapper para funciones async en routes
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Middleware para rutas no encontradas (404)
 * Debe ir ANTES del errorHandler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new AppError(`Ruta no encontrada: ${req.originalUrl}`, 404);
  next(error);
};
