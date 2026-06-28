import { BadRequestError } from '../exceptions/BadRequestError.js';
import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { MESSAGE } from '../constants/message.js';
import { StoreRepository } from '../repositories/StoreRepository.js';

export const StoreService = {
    async create(sellerId, { storeName, description, logo }) {
        const existingStore = await StoreRepository.findBySellerId(sellerId);
        if (existingStore) {
            throw new BadRequestError(MESSAGE.STORE.ALREADY_EXISTS);
        }

        const store = await StoreRepository.create({
            sellerId,
            storeName,
            description,
            logo
        });
        return store;
    },

    async getAll() {
        return await StoreRepository.findAll();
    },

    async getById(id) {
        const store = await StoreRepository.findById(id);
        if (!store) throw new NotFoundError(MESSAGE.STORE.NOT_FOUND);
        return store;
    },

    async update(id, sellerId, data) {
        const store = await this.getById(id);
        if (store.sellerId !== sellerId) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        }

        return await StoreRepository.update(id, data);
    },

    async delete(id, sellerId) {
        const store = await this.getById(id);
        if (store.sellerId !== sellerId) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        }

        return await StoreRepository.delete(id);
    }
};
