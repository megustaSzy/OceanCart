import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import express from 'express';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { sendResponse } from '../utils/response.js';
import { VoucherRepository } from '../repositories/VoucherRepository.js';
import { AdminRepository } from '../repositories/AdminRepository.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { AdminValidator } from '../validators/adminValidator.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('ADMIN'));

router.post('/vouchers', validate(AdminValidator.createVoucher), async (req, res, next) => {
    try {
        const { code, discount, expiredAt, remainingUsage } = req.body;
        const voucher = await VoucherRepository.create({
            code,
            discount,
            expiredAt: new Date(expiredAt),
            remainingUsage: remainingUsage || 100
        });
        return sendResponse(res, HttpStatus.CREATED, MESSAGE.ADMIN.VOUCHER_CREATED, voucher);
    } catch (error) {
        next(error);
    }
});

router.get('/vouchers', async (req, res, next) => {
    try {
        const vouchers = await VoucherRepository.findAll();
        return sendResponse(res, HttpStatus.OK, MESSAGE.ADMIN.VOUCHERS_FETCHED, vouchers);
    } catch (error) {
        next(error);
    }
});

router.get('/dashboard', async (req, res, next) => {
    try {
        const stats = await AdminRepository.getDashboardStats();
        return sendResponse(res, HttpStatus.OK, MESSAGE.ADMIN.DASHBOARD_FETCHED, stats);
    } catch (error) {
        next(error);
    }
});

export default router;
