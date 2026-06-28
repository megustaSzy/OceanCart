import { prisma } from '../prisma/prisma.js';

export const ReviewRepository = {
    async create(data) {
        return await prisma.review.create({ data });
    },

    async findByProductId(productId) {
        return await prisma.review.findMany({
            where: { productId: parseInt(productId) },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }
};
