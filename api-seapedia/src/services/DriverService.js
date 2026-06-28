import { BadRequestError } from '../exceptions/BadRequestError.js';
import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { MESSAGE } from '../constants/message.js';
import { DriverRepository } from '../repositories/DriverRepository.js';
import { OrderRepository } from '../repositories/OrderRepository.js';
import { WalletRepository } from '../repositories/WalletRepository.js';
import { executeTransaction } from '../repositories/Transaction.js';

export const DriverService = {
    async getJobs(driverId) {
        return await DriverRepository.findJobs(driverId);
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

        const order = await OrderRepository.findById(orderId);
        
        let driverWallet = await WalletRepository.findByUserId(driverId);
        if (!driverWallet) driverWallet = await WalletRepository.create(driverId);
        
        let sellerWallet = await WalletRepository.findByUserId(order.store.sellerId);
        if (!sellerWallet) sellerWallet = await WalletRepository.create(order.store.sellerId);

        return await executeTransaction(async (tx) => {
            await Promise.all([
                OrderRepository.updateStatus(orderId, 'Pesanan_Selesai', undefined, tx),
                OrderRepository.createHistory(orderId, 'Pesanan_Selesai', tx),
                DriverRepository.updateJobStatus(orderId, 'Completed', tx),

                // Pay Driver
                WalletRepository.incrementBalance(driverId, parseFloat(order.deliveryFee), tx),
                WalletRepository.createTransaction({
                    walletId: driverWallet.id,
                    amount: parseFloat(order.deliveryFee),
                    type: 'PAYMENT',
                    description: `Delivery Fee for Order #${orderId}`
                }, tx),

                // Pay Seller
                WalletRepository.incrementBalance(order.store.sellerId, parseFloat(order.subtotal), tx),
                WalletRepository.createTransaction({
                    walletId: sellerWallet.id,
                    amount: parseFloat(order.subtotal),
                    type: 'PAYMENT',
                    description: `Product Revenue from Order #${orderId}`
                }, tx)
            ]);
            
            return { message: MESSAGE.DRIVER.JOB_COMPLETED };
        });
    }
};
