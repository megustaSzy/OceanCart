import { prisma } from '../prisma/prisma.js';

export const StoreRepository = {
    async findBySellerId(sellerId) {
        return await prisma.store.findUnique({
            where: { sellerId }
        });
    },

    async findById(id) {
        return await prisma.store.findUnique({
            where: { id: parseInt(id) }
        });
    },

    async findAll() {
        return await prisma.store.findMany();
    },

    async create(data) {
        return await prisma.store.create({ data });
    },

    async update(id, data) {
        return await prisma.store.update({
            where: { id: parseInt(id) },
            data
        });
    },

    async delete(id) {
        return await prisma.store.delete({
            where: { id: parseInt(id) }
        });
    }
};
