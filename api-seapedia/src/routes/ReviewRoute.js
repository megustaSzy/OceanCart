import express from 'express';
import { ReviewController } from '../controllers/ReviewController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { ReviewValidator } from '../validators/reviewValidator.js';

const router = express.Router();

router.get('/product/:productId', ReviewController.getByProduct);
router.post('/', protect, requireRole('BUYER'), validate(ReviewValidator.create), ReviewController.create);

export default router;
