import express from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { OrderValidator } from '../validators/orderValidator.js';

const router = express.Router();

router.use(protect);

router.post('/check-voucher', requireRole('BUYER'), OrderController.checkVoucher);
router.post('/checkout', requireRole('BUYER'), validate(OrderValidator.checkout), OrderController.checkout);
router.get('/buyer', requireRole('BUYER'), OrderController.getBuyerOrders);
router.get('/seller', requireRole('SELLER'), OrderController.getSellerOrders);
router.get('/:id', OrderController.getOrderById);
router.put('/:id/status', requireRole('SELLER'), validate(OrderValidator.updateStatus), OrderController.updateStatus);

export default router;
