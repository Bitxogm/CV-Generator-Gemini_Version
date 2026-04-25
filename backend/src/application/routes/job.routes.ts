import { Router } from 'express';
import { extractJobFromUrl } from '../controllers/job';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: Router = Router();

// POST /api/jobs/extract-from-url - Extraer información de URL
router.post('/extract-from-url', authMiddleware, extractJobFromUrl);

export default router;