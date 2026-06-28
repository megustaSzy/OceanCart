import { BadRequestError } from '../exceptions/BadRequestError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { MESSAGE } from '../constants/message.js';
import { ReviewRepository } from '../repositories/ReviewRepository.js';
import { OrderRepository } from '../repositories/OrderRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';

export const ReviewService = {
    async create(userId, { productId, rating, comment }) {
        const product = await ProductRepository.findById(productId);
        if (!product) throw new NotFoundError(MESSAGE.PRODUCT.NOT_FOUND);

        // Check if user has bought the product
        const hasBought = await OrderRepository.hasBoughtProduct(userId, productId);
        if (!hasBought) {
            throw new BadRequestError(MESSAGE.REVIEW.NOT_BOUGHT);
        }

        return await ReviewRepository.create({
            userId,
            productId,
            rating,
            comment
        });
    },

    async getByProductId(productId) {
        return await ReviewRepository.findByProductId(productId);
    }
};
