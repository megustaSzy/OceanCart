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
    }
};
