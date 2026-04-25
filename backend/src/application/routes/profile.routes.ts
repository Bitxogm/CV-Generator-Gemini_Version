import { Router, IRouter } from 'express';
import { createProfile, getMyProfile, getById, updateProfile } from '../controllers/profile';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: IRouter = Router();

// Rutas públicas
router.get('/:id', getById);

// Rutas protegidas
router.post('/', authMiddleware, createProfile);
router.get('/me', authMiddleware, getMyProfile);
router.put('/:id', authMiddleware, updateProfile);

export default router;
