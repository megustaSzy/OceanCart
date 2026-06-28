import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { OrderService } from '../services/OrderService.js';
import { sendResponse } from '../utils/response.js';
import { OrderUtils } from '../utils/orderUtils.js';

export const OrderController = {
    async checkVoucher(req, res, next) {
        try {
            let { voucherCode } = req.body;
            if (!voucherCode) return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Kode voucher tidak boleh kosong" });
            
            voucherCode = voucherCode.trim();
            const discount = await OrderUtils.getDiscountAmount(voucherCode);
            if (discount > 0) {
                return sendResponse(res, HttpStatus.OK, "Voucher berhasil diterapkan!", { discount });
            } else {
                return res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Kode voucher tidak valid atau sudah kadaluarsa" });
            }
        } catch (error) {
            next(error);
        }
    },

    async checkout(req, res, next) {
        try {
            const data = await OrderService.checkout(req.user.id, req.body);
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.ORDER.CREATED, data);
        } catch (error) {
            next(error);
        }
    },

    async getOrderById(req, res, next) {
        try {
            const orderId = parseInt(req.params.id);
            const data = await OrderService.getOrderById(orderId, req.user.id, req.user.activeRole);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ORDER.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async getBuyerOrders(req, res, next) {
        try {
            const data = await OrderService.getBuyerOrders(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ORDER.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async getSellerOrders(req, res, next) {
        try {
            const data = await OrderService.getSellerOrders(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ORDER.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async updateStatus(req, res, next) {
        try {
            const data = await OrderService.updateStatus(req.params.id, req.user.id, req.body.status);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ORDER.STATUS_UPDATED, data);
        } catch (error) {
            next(error);
        }
    }
}

