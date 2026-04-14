import { Router, IRouter } from 'express';
import { AuthController } from '../controllers/AuthController';
import { SignUpUseCase } from '../../domain/use-cases/auth/SignUpUseCase';
import { SignInUseCase } from '../../domain/use-cases/auth/SignInUseCase';
import { RecoverPasswordUseCase } from '../../domain/use-cases/auth/RecoverPasswordUseCase';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { JWTService } from '../../infrastructure/services/JWTService';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';

const router: IRouter = Router();

// Inicializar dependencias
const userRepository = new PrismaUserRepository(prisma);
const jwtService = new JWTService();

// Inicializar use cases
const signUpUseCase = new SignUpUseCase(userRepository, jwtService);
const signInUseCase = new SignInUseCase(userRepository, jwtService);
const recoverPasswordUseCase = new RecoverPasswordUseCase(userRepository, jwtService);

// Inicializar controller
const authController = new AuthController(signUpUseCase, signInUseCase, recoverPasswordUseCase);

// Rutas
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/request-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

export default router;
