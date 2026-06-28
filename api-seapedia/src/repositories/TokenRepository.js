import { prisma } from '../prisma/prisma.js';

export const TokenRepository = {
    async create(userId, refreshToken, expiresInDays = 7) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + expiresInDays);

        return await prisma.token.create({
            data: {
                userId,
                refreshToken,
                expiresAt
            }
        });
    },

    async findByToken(refreshToken) {
        return await prisma.token.findUnique({
            where: { refreshToken },
            include: { user: true }
        });
    },

    async deleteByToken(refreshToken) {
        return await prisma.token.delete({
            where: { refreshToken }
        }).catch(() => null); // ignore if already deleted
    },

    async deleteByUserId(userId) {
        return await prisma.token.deleteMany({
            where: { userId }
        });
    }
};
