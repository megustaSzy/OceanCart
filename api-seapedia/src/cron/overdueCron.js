import cron from 'node-cron';
import { OrderRepository } from '../repositories/OrderRepository.js';
import { WalletRepository } from '../repositories/WalletRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { executeTransaction } from '../repositories/Transaction.js';

// Run every hour
cron.schedule('0 * * * *', async () => {
    console.log('Running Overdue Cron Job...');
    try {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        
        // Find orders that are in "Sedang_Dikemas" for more than 2 days
        const overdueOrders = await OrderRepository.findOverdue(twoDaysAgo);

        for (const order of overdueOrders) {
            await executeTransaction(async (tx) => {
                // Update status
                await OrderRepository.updateStatus(order.id, 'Dikembalikan', undefined, tx);
                await OrderRepository.createHistory(order.id, 'Dikembalikan', tx);

                // Refund to wallet
                const wallet = await WalletRepository.incrementBalance(order.buyerId, order.total, tx);
                
                await WalletRepository.createTransaction({
                    walletId: wallet.id,
                    amount: order.total,
                    type: 'REFUND',
                    description: `Refund for Order #${order.id}`
                }, tx);

                // Restore stock
                for (const item of order.items) {
                    await ProductRepository.updateStock(item.productId, item.quantity, tx);
                }
            });
            console.log(`Order #${order.id} has been automatically canceled and refunded.`);
        }
    } catch (error) {
        console.error('Error in Overdue Cron:', error);
    }
});

console.log('Overdue Cron Job Scheduled.');
