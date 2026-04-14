import { Router, IRouter } from 'express';
import { ProfileController } from '../controllers/ProfileController';
import { CreateProfileUseCase } from '../../domain/use-cases/profile/CreateProfileUseCase';
import { UpdateProfileUseCase } from '../../domain/use-cases/profile/UpdateProfileUseCase';
import { GetProfileUseCase } from '../../domain/use-cases/profile/GetProfileUseCase';
import { GetMyProfileUseCase } from '../../domain/use-cases/profile/GetMyProfileUseCase';
import { PrismaProfileRepository } from '../../infrastructure/repositories/PrismaProfileRepository';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: IRouter = Router();

// Inicializar repositorios
const profileRepository = new PrismaProfileRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);

// Inicializar use cases
const createProfileUseCase = new CreateProfileUseCase(profileRepository, userRepository);
const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
const getProfileUseCase = new GetProfileUseCase(profileRepository);
const getMyProfileUseCase = new GetMyProfileUseCase(profileRepository);

// Inicializar controller
const profileController = new ProfileController(
  createProfileUseCase,
  updateProfileUseCase,
  getProfileUseCase,
  getMyProfileUseCase
);

// Rutas públicas
router.get('/:id', profileController.getById);

// Rutas protegidas
router.post('/', authMiddleware, profileController.create);
router.get('/me', authMiddleware, profileController.getMyProfile);
router.put('/:id', authMiddleware, profileController.update);

export default router;
