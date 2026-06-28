import { VoucherRepository } from '../repositories/VoucherRepository.js';

export const VoucherService = {
    async getActiveVouchers() {
        const vouchers = await VoucherRepository.findAll();
        return vouchers.filter(v => new Date(v.expiredAt) > new Date() && v.remainingUsage > 0);
    }
};
