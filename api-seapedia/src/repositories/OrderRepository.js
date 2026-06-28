import { prisma } from '../prisma/prisma.js';

export const OrderRepository = {
    async findByBuyerId(buyerId) {
        return await prisma.order.findMany({
            where: { buyerId },
            include: { items: { include: { product: true } }, histories: true }
        });
    },

    async findByStoreId(storeId) {
        return await prisma.order.findMany({
            where: { storeId },
            include: { items: { include: { product: true } }, histories: true }
        });
    },

    async findById(id) {
        return await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { store: true }
        });
    },
    
    async findOverdue(beforeDate) {
        return await prisma.order.findMany({
            where: { status: 'Sedang_Dikemas', createdAt: { lt: beforeDate } },
            include: { items: true }
        });
    },

    async findCompletedByStore(storeId) {
        return await prisma.order.findMany({
            where: { storeId: parseInt(storeId), status: 'Pesanan_Selesai' },
            select: { subtotal: true, createdAt: true }
        });
    },
    
    async count() {
        return await prisma.order.count();
    },

    async createOrder(data, tx = prisma) {
        return await tx.order.create({ data });
    },

    async updateStatus(orderId, status, driverId, tx = prisma) {
        return await tx.order.update({
            where: { id: parseInt(orderId) },
            data: { status, driverId }
        });
    },

    async hasBoughtProduct(buyerId, productId) {
        const order = await prisma.order.findFirst({
            where: {
                buyerId,
                status: 'Pesanan_Selesai',
                items: {
                    some: { productId: parseInt(productId) }
                }
            }
        });
        return !!order;
    },

    async createHistory(orderId, status, tx = prisma) {
        return await tx.orderStatusHistory.create({
            data: { orderId: parseInt(orderId), status }
        });
    }
};
