import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../infrastructure/services/JWTService';
import { UnauthorizedError } from '../../domain/errors/AppError';

// Extender Request para incluir userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      userRole?: string;
    }
  }
}

const jwtService = new JWTService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    // Formato: "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Formato de token inválido');
    }

    // Verificar token
    const payload = jwtService.verifyToken(token);

    // Agregar info al request
    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userRole = payload.role;

    next();
  } catch (error) {
    next(new UnauthorizedError('Token inválido o expirado'));
  }
};
