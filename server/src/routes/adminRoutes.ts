import { Router } from 'express';
import { getAllStudentsPerformance } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);
router.get('/students', getAllStudentsPerformance);

export default router;
