import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../infrastructure/services/JWTService';

const jwtService = new JWTService();

export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const payload = jwtService.verifyToken(token);
        req.userId = payload.userId;
        req.userEmail = payload.email;
        req.userRole = payload.role;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
