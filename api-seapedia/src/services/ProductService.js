import { BadRequestError } from '../exceptions/BadRequestError.js';
import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { MESSAGE } from '../constants/message.js';
import { StoreRepository } from '../repositories/StoreRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';

export const ProductService = {
    async create(sellerId, { name, description, price, stock, image }) {
        const store = await StoreRepository.findBySellerId(sellerId);
        if (!store) {
            throw new BadRequestError(MESSAGE.PRODUCT.NO_STORE);
        }

        return await ProductRepository.create({
            storeId: store.id,
            name,
            description,
            price,
            stock,
            image
        });
    },

    async getAll() {
        return await ProductRepository.findAll();
    },

    async getById(id) {
        const product = await ProductRepository.findById(id);
        if (!product) throw new NotFoundError(MESSAGE.PRODUCT.NOT_FOUND);
        return product;
    },

    async update(id, sellerId, data) {
        const product = await this.getById(id);
        if (product.store.sellerId !== sellerId) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        }

        return await ProductRepository.update(id, data);
    },

    async delete(id, sellerId) {
        const product = await this.getById(id);
        if (product.store.sellerId !== sellerId) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        }

        return await ProductRepository.delete(id);
    }
};
