import { Request, Response, NextFunction } from 'express';
import { SignUpUseCase } from '../../domain/use-cases/auth/SignUpUseCase';
import { SignInUseCase } from '../../domain/use-cases/auth/SignInUseCase';
import { RecoverPasswordUseCase } from '../../domain/use-cases/auth/RecoverPasswordUseCase';
import { BadRequestError } from '../../domain/errors/AppError';

export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
    private readonly recoverPasswordUseCase: RecoverPasswordUseCase
  ) {}

  // POST /api/auth/signup
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, password } = req.body;

      // Validación básica
      if (!email || !username || !password) {
        throw new BadRequestError('Email, username y password son requeridos');
      }

      const result = await this.signUpUseCase.execute({ email, username, password });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/auth/signin
  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new BadRequestError('Email y password son requeridos');
      }

      const result = await this.signInUseCase.execute({ email, password });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/auth/request-reset
  requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new BadRequestError('Email es requerido');
      }

      const result = await this.recoverPasswordUseCase.requestPasswordReset({ email });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/auth/reset-password
  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw new BadRequestError('Token y nueva contraseña son requeridos');
      }

      const result = await this.recoverPasswordUseCase.resetPassword({ token, newPassword });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
