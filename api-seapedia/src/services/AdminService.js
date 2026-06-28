import { VoucherRepository } from '../repositories/VoucherRepository.js';
import { AdminRepository } from '../repositories/AdminRepository.js';

export const AdminService = {
    async createVoucher(data) {
        return await VoucherRepository.create({
            code: data.code,
            description: data.description,
            discount: data.discount,
            expiredAt: new Date(data.expiredAt),
            remainingUsage: data.remainingUsage || 100
        });
    },

    async getVouchers() {
        return await VoucherRepository.findAll();
    },

    async updateVoucher(id, updateData) {
        const data = {};
        if (updateData.code) data.code = updateData.code;
        if (updateData.description !== undefined) data.description = updateData.description;
        if (updateData.discount) data.discount = updateData.discount;
        if (updateData.expiredAt) data.expiredAt = new Date(updateData.expiredAt);
        if (updateData.remainingUsage !== undefined) data.remainingUsage = updateData.remainingUsage;
        
        return await VoucherRepository.update(id, data);
    },

    async deleteVoucher(id) {
        return await VoucherRepository.delete(id);
    },

    async getDashboardStats() {
        return await AdminRepository.getDashboardStats();
    }
};
