import { prisma } from '../prisma/prisma.js';

export const VoucherRepository = {
    async findByCode(code) {
        return await prisma.voucher.findUnique({ where: { code } });
    },

    async findAll() {
        return await prisma.voucher.findMany();
    },

    async create(data) {
        return await prisma.voucher.create({ data });
    },

    async decrementUsage(code, tx = prisma) {
        return await tx.voucher.update({
            where: { code },
            data: { remainingUsage: { decrement: 1 } }
        });
    },

    async update(id, data) {
        return await prisma.voucher.update({ where: { id: parseInt(id) }, data });
    },

    async delete(id) {
        return await prisma.voucher.delete({ where: { id: parseInt(id) } });
    }
};
