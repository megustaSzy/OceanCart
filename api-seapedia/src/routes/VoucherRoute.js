import express from 'express';
import { VoucherController } from '../controllers/VoucherController.js';

const router = express.Router();

router.get('/', VoucherController.getActiveVouchers);

export default router;
