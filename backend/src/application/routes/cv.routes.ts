import { Router, IRouter } from 'express';
import {
  createCV,
  getMyCVs,
  getById,
  updateCV,
  deleteCV,
  adaptToJobOffer,
  generateSuggestions,
  generateCoverLetter,
} from '../controllers/cv';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: IRouter = Router();

router.use(authMiddleware);

// CRUD
router.post('/', createCV);
router.get('/', getMyCVs);
router.get('/:id', getById);
router.put('/:id', updateCV);
router.delete('/:id', deleteCV);

// Operaciones IA
router.post('/:id/adapt', adaptToJobOffer);
router.post('/:id/suggestions', generateSuggestions);
router.post('/:id/cover-letter', generateCoverLetter);

export default router;
