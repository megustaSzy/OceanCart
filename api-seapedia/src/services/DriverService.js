import { BadRequestError } from '../exceptions/BadRequestError.js';
import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { MESSAGE } from '../constants/message.js';
import { DriverRepository } from '../repositories/DriverRepository.js';
import { OrderRepository } from '../repositories/OrderRepository.js';
import { executeTransaction } from '../repositories/Transaction.js';

export const DriverService = {
    async getAvailableJobs() {
        return await DriverRepository.findAvailableJobs();
    },

    async takeJob(driverId, orderId) {
        const order = await OrderRepository.findById(orderId);
        if (!order || order.status !== 'Menunggu_Pengirim' || order.driverId) {
            throw new BadRequestError(MESSAGE.DRIVER.JOB_UNAVAILABLE);
        }

        return await executeTransaction(async (tx) => {
            const [updatedOrder] = await Promise.all([
                OrderRepository.updateStatus(orderId, 'Sedang_Dikirim', driverId, tx),
                OrderRepository.createHistory(orderId, 'Sedang_Dikirim', tx),
                DriverRepository.createJob(orderId, driverId, 'In_Progress', tx)
            ]);

            return updatedOrder;
        });
    },

    async completeJob(driverId, orderId) {
        const job = await DriverRepository.findJobByOrderId(orderId);

        if (!job || job.driverId !== driverId) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        }

        return await executeTransaction(async (tx) => {
            await Promise.all([
                OrderRepository.updateStatus(orderId, 'Pesanan_Selesai', undefined, tx),
                OrderRepository.createHistory(orderId, 'Pesanan_Selesai', tx),
                DriverRepository.updateJobStatus(orderId, 'Completed', tx)
            ]);
            
            return { message: 'Job completed' };
        });
    }
};
