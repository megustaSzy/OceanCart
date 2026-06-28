import express from 'express';
import { StoreController } from '../controllers/StoreController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { StoreValidator } from '../validators/storeValidator.js';

const router = express.Router();

router.get('/', StoreController.getAll);
router.get('/revenue-report', protect, requireRole('SELLER'), StoreController.getRevenueReport);
router.get('/:id', StoreController.getById);

router.post('/', protect, requireRole('SELLER'), validate(StoreValidator.create), StoreController.create);
router.put('/:id', protect, requireRole('SELLER'), validate(StoreValidator.update), StoreController.update);
router.delete('/:id', protect, requireRole('SELLER'), StoreController.delete);

export default router;
