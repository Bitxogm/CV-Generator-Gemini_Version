import { Router, IRouter } from 'express';
import { signup, signin, requestPasswordReset, resetPassword, deleteAccount } from '../controllers/auth';
import { authMiddleware } from '../middlewares/authMiddleware';

const router: IRouter = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.delete('/account', authMiddleware, deleteAccount);

export default router;
