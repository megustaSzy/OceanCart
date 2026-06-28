import express from 'express';
import { WalletController } from '../controllers/WalletController.js';
import { protect, requireRole } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { WalletValidator } from '../validators/walletValidator.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('BUYER', 'SELLER', 'DRIVER'));

router.get('/', WalletController.getWallet);
router.get('/history', WalletController.getHistory);
router.post('/topup', WalletController.topUp);

export default router;
