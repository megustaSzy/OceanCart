import { WalletRepository } from '../repositories/WalletRepository.js';
import { executeTransaction } from '../repositories/Transaction.js';

export const WalletService = {
    async getWallet(userId) {
        let wallet = await WalletRepository.findByUserId(userId);

        if (!wallet) {
            wallet = await WalletRepository.create(userId);
        }
        return wallet;
    },

    async getHistory(userId) {
        const wallet = await this.getWallet(userId);
        return await WalletRepository.findHistory(wallet.id);
    },

    async topUp(userId, { amount, description = 'Top Up Wallet' }) {
        const wallet = await this.getWallet(userId);

        return await executeTransaction(async (tx) => {
            const [w] = await Promise.all([
                WalletRepository.incrementBalance(userId, amount, tx),
                WalletRepository.createTransaction({
                    walletId: wallet.id,
                    amount,
                    type: 'TOPUP',
                    description
                }, tx)
            ]);

            return w;
        });
    }
};
