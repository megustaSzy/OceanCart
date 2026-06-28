import { prisma } from '../prisma/prisma.js';

export const AdminRepository = {
    async getDashboardStats() {
        const [totalUsers, totalOrders, totalProducts] = await Promise.all([
            prisma.user.count(),
            prisma.order.count(),
            prisma.product.count()
        ]);

        return { totalUsers, totalOrders, totalProducts };
    }
};
