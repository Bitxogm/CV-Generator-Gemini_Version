import { Router, IRouter } from 'express';
import { createProfile, getMyProfile, getById, updateProfile } from '../controllers/profile';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: IRouter = Router();

// Rutas protegidas
router.post('/', authMiddleware, createProfile);
router.get('/me', authMiddleware, getMyProfile);
router.put('/:id', authMiddleware, updateProfile);

// Rutas públicas
router.get('/:id', getById);

export default router;
