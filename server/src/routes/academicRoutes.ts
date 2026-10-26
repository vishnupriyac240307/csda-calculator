import { Router } from 'express';
import {
  getAllAcademicRecords,
  getSemesterRecord,
  saveSemesterMarks,
  resetSemesterMarks,
  resetAllAcademicMarks
} from '../controllers/academicController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect); // All academic routes are protected

router.get('/', getAllAcademicRecords);
router.get('/semesters/:semester', getSemesterRecord);
router.put('/semesters/:semester', saveSemesterMarks);
router.delete('/semesters/:semester', resetSemesterMarks);
router.delete('/', resetAllAcademicMarks);

export default router;
