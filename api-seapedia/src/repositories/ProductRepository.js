import { prisma } from '../prisma/prisma.js';

export const ProductRepository = {
    async findById(id) {
        return await prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { store: true }
        });
    },

    async findAll() {
        return await prisma.product.findMany({
            include: { store: true }
        });
    },

    async create(data) {
        return await prisma.product.create({ data });
    },

    async update(id, data) {
        return await prisma.product.update({
            where: { id: parseInt(id) },
            data
        });
    },

    async delete(id) {
        return await prisma.product.delete({
            where: { id: parseInt(id) }
        });
    },
    
    async updateStock(id, amount, tx = prisma) {
        return await tx.product.update({
            where: { id: parseInt(id) },
            data: { stock: { increment: amount } }
        });
    }
};
