import express from 'express';
import { AddressController } from '../controllers/AddressController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddleware.js';
import { AddressValidator } from '../validators/addressValidator.js';

const router = express.Router();

router.use(protect);

router.post('/', validate(AddressValidator.create), AddressController.create);
router.get('/', AddressController.getAll);
router.get('/:id', AddressController.getById);
router.put('/:id', validate(AddressValidator.update), AddressController.update);
router.delete('/:id', AddressController.delete);

export default router;
