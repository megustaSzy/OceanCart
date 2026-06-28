import express from 'express';
import { DriverController } from '../controllers/DriverController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('DRIVER'));

router.get('/jobs', DriverController.getJobs);
router.post('/jobs/take', DriverController.takeJob);
router.post('/jobs/complete', DriverController.completeJob);

export default router;
