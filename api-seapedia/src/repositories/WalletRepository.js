import { prisma } from '../prisma/prisma.js';

export const WalletRepository = {
    async findByUserId(userId, tx = prisma) {
        return await tx.wallet.findUnique({
            where: { userId }
        });
    },

    async create(userId) {
        return await prisma.wallet.create({
            data: { userId, balance: 0 }
        });
    },

    async incrementBalance(userId, amount, tx = prisma) {
        return await tx.wallet.update({
            where: { userId },
            data: { balance: { increment: amount } }
        });
    },
    
    async decrementBalance(userId, amount, tx = prisma) {
        return await tx.wallet.update({
            where: { userId },
            data: { balance: { decrement: amount } }
        });
    },

    async findHistory(walletId) {
        return await prisma.walletTransaction.findMany({
            where: { walletId },
            orderBy: { createdAt: 'desc' }
        });
    },

    async createTransaction(data, tx = prisma) {
        return await tx.walletTransaction.create({ data });
    }
};
