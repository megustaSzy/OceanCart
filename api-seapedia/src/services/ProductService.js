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

    async getAll({ page = 1, limit = 8, search = '' } = {}) {
        const skip = (page - 1) * limit;
        const { items, total } = await ProductRepository.findAll({ skip, take: limit, search });
        
        return {
            items,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };
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
