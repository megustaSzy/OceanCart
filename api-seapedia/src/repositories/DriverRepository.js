import { prisma } from '../prisma/prisma.js';

export const DriverRepository = {
    async findJobs(driverId) {
        return await prisma.order.findMany({
            where: {
                OR: [
                    { status: 'Menunggu_Pengirim', driverId: null },
                    { status: 'Sedang_Dikirim', driverId: parseInt(driverId) }
                ]
            },
            include: { 
                store: true, 
                buyer: {
                    include: { addresses: true }
                } 
            }
        });
    },

    async findJobByOrderId(orderId) {
        return await prisma.deliveryJob.findUnique({
            where: { orderId: parseInt(orderId) }
        });
    },

    async createJob(orderId, driverId, status, tx = prisma) {
        return await tx.deliveryJob.create({
            data: { orderId: parseInt(orderId), driverId, status }
        });
    },

    async updateJobStatus(orderId, status, tx = prisma) {
        return await tx.deliveryJob.update({
            where: { orderId: parseInt(orderId) },
            data: { status }
        });
    }
};
