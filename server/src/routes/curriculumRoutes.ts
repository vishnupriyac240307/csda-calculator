import { Router } from 'express';
import { getCurriculum, updateCurriculumConfig } from '../controllers/curriculumController';

const router = Router();

router.get('/', getCurriculum);
router.post('/', updateCurriculumConfig);

export default router;
