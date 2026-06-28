import express from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { ProductValidator } from '../validators/productValidator.js';

const router = express.Router();

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getById);

router.post('/', protect, requireRole('SELLER'), ProductController.create);
router.put('/:id', protect, requireRole('SELLER'), ProductController.update);
router.delete('/:id', protect, requireRole('SELLER'), ProductController.delete);

export default router;
