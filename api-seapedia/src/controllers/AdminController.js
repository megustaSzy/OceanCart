import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { sendResponse } from '../utils/response.js';
import { AdminService } from '../services/AdminService.js';

export const AdminController = {
    async createVoucher(req, res, next) {
        try {
            const voucher = await AdminService.createVoucher(req.body);
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.ADMIN.VOUCHER_CREATED || "Voucher berhasil dibuat", voucher);
        } catch (error) {
            next(error);
        }
    },

    async getVouchers(req, res, next) {
        try {
            const vouchers = await AdminService.getVouchers();
            return sendResponse(res, HttpStatus.OK, MESSAGE.ADMIN.VOUCHERS_FETCHED || "Voucher berhasil diambil", vouchers);
        } catch (error) {
            next(error);
        }
    },

    async updateVoucher(req, res, next) {
        try {
            const voucher = await AdminService.updateVoucher(req.params.id, req.body);
            return sendResponse(res, HttpStatus.OK, "Voucher berhasil diupdate", voucher);
        } catch (error) {
            next(error);
        }
    },

    async deleteVoucher(req, res, next) {
        try {
            await AdminService.deleteVoucher(req.params.id);
            return sendResponse(res, HttpStatus.OK, "Voucher berhasil dihapus", null);
        } catch (error) {
            next(error);
        }
    },

    async getDashboardStats(req, res, next) {
        try {
            const stats = await AdminService.getDashboardStats();
            return sendResponse(res, HttpStatus.OK, MESSAGE.ADMIN.DASHBOARD_FETCHED || "Data dashboard berhasil diambil", stats);
        } catch (error) {
            next(error);
        }
    }
};
