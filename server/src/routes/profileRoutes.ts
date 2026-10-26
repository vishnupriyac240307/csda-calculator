import { Router } from 'express';
import { getProfile, updateProfile, changePassword } from '../controllers/profileController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // All profile routes require authentication

router.get('/', getProfile);
router.patch('/', updateProfile);
router.patch('/password', changePassword);

export default router;
