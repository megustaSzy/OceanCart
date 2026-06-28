import express from 'express';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { AdminValidator } from '../validators/adminValidator.js';
import { AdminController } from '../controllers/AdminController.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('ADMIN'));

router.post('/vouchers', validate(AdminValidator.createVoucher), AdminController.createVoucher);
router.get('/vouchers', AdminController.getVouchers);
router.put('/vouchers/:id', AdminController.updateVoucher);
router.delete('/vouchers/:id', AdminController.deleteVoucher);

router.get('/dashboard', AdminController.getDashboardStats);

export default router;
