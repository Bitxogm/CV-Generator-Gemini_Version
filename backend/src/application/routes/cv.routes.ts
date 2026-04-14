import { Router, IRouter } from 'express';
import { CVController } from '../controllers/CVController';
import { CreateCVUseCase } from '../../domain/use-cases/cv/CreateCVUseCase';
import { GetCVUseCase } from '../../domain/use-cases/cv/GetCVUseCase';
import { GetMyCVsUseCase } from '../../domain/use-cases/cv/GetMyCVsUseCase';
import { UpdateCVUseCase } from '../../domain/use-cases/cv/UpdateCVUseCase';
import { DeleteCVUseCase } from '../../domain/use-cases/cv/DeleteCVUseCase';
import { AdaptToJobOfferUseCase } from '../../domain/use-cases/cv/AdaptToJobOfferUseCase';
import { GenerateSuggestionsUseCase } from '../../domain/use-cases/cv/GenerateSuggestionsUseCase';
import { GenerateCoverLetterUseCase } from '../../domain/use-cases/cv/GenerateCoverLetterUseCase';
import { PrismaCVRepository } from '../../infrastructure/repositories/PrismaCVRepository';
import { PrismaUserRepository } from '../../infrastructure/repositories/PrismaUserRepository';
import { GeminiService } from '../../infrastructure/services/GeminiService';
import { prisma } from '../../infrastructure/database/prisma/PrismaClient';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: IRouter = Router();

// Inicializar repositorios y servicios
const cvRepository = new PrismaCVRepository(prisma);
const userRepository = new PrismaUserRepository(prisma);
const geminiService = new GeminiService();

// Inicializar use cases
const createCVUseCase = new CreateCVUseCase(cvRepository, userRepository);
const getCVUseCase = new GetCVUseCase(cvRepository);
const getMyCVsUseCase = new GetMyCVsUseCase(cvRepository);
const updateCVUseCase = new UpdateCVUseCase(cvRepository);
const deleteCVUseCase = new DeleteCVUseCase(cvRepository);
const adaptToJobOfferUseCase = new AdaptToJobOfferUseCase(cvRepository, geminiService);
const generateSuggestionsUseCase = new GenerateSuggestionsUseCase(cvRepository, geminiService);
const generateCoverLetterUseCase = new GenerateCoverLetterUseCase(cvRepository, geminiService);

// Inicializar controller
const cvController = new CVController(
  createCVUseCase,
  getCVUseCase,
  getMyCVsUseCase,
  updateCVUseCase,
  deleteCVUseCase,
  adaptToJobOfferUseCase,
  generateSuggestionsUseCase,
  generateCoverLetterUseCase
);

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// CRUD
router.post('/', cvController.create);
router.get('/', cvController.getMyCVs);
router.get('/:id', cvController.getById);
router.put('/:id', cvController.update);
router.delete('/:id', cvController.delete);

// Operaciones IA
router.post('/:id/adapt', cvController.adaptToJobOffer);
router.post('/:id/suggestions', cvController.generateSuggestions);
router.post('/:id/cover-letter', cvController.generateCoverLetter);

export default router;
