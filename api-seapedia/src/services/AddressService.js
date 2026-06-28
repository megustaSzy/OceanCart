import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { MESSAGE } from '../constants/message.js';
import { AddressRepository } from '../repositories/AddressRepository.js';

export const AddressService = {
    async create(userId, data) {
        return await AddressRepository.create({ ...data, userId });
    },

    async getAll(userId) {
        return await AddressRepository.findByUserId(userId);
    },

    async getById(userId, id) {
        const address = await AddressRepository.findById(id);
        if (!address) throw new NotFoundError(MESSAGE.ADDRESS.NOT_FOUND);
        if (address.userId !== userId) throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        
        return address;
    },

    async update(userId, id, data) {
        await this.getById(userId, id); // check existence and ownership
        return await AddressRepository.update(id, data);
    },

    async delete(userId, id) {
        await this.getById(userId, id); // check existence and ownership
        return await AddressRepository.delete(id);
    }
};
