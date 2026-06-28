import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { AuthValidator } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', validate(AuthValidator.register), AuthController.register);
router.post('/login', validate(AuthValidator.login), AuthController.login);
router.post('/refresh-token', validate(AuthValidator.refreshToken), AuthController.refreshToken);
router.post('/logout', protect, AuthController.logout);
router.get('/profile', protect, AuthController.profile);
router.post('/select-role', protect, validate(AuthValidator.selectRole), AuthController.selectRole);

export default router;
