import express from 'express';
import { CartController } from '../controllers/CartController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { CartValidator } from '../validators/cartValidator.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('BUYER'));

router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/', CartController.updateCart);
router.delete('/:id', CartController.deleteCart);

export default router;
