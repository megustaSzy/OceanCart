import { prisma } from '../prisma/prisma.js';

export const AddressRepository = {
    async create(data) {
        return await prisma.address.create({ data });
    },

    async findByUserId(userId) {
        return await prisma.address.findMany({
            where: { userId }
        });
    },

    async findById(id) {
        return await prisma.address.findUnique({
            where: { id: parseInt(id) }
        });
    },

    async update(id, data) {
        return await prisma.address.update({
            where: { id: parseInt(id) },
            data
        });
    },

    async delete(id) {
        return await prisma.address.delete({
            where: { id: parseInt(id) }
        });
    }
};
