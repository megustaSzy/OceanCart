import { HttpStatus } from '../constants/http-status.js';
import { MESSAGE } from '../constants/message.js';
import { sendResponse } from '../utils/response.js';
import { VoucherService } from '../services/VoucherService.js';

export const VoucherController = {
    async getActiveVouchers(req, res, next) {
        try {
            const activeVouchers = await VoucherService.getActiveVouchers();
            return sendResponse(res, HttpStatus.OK, MESSAGE.VOUCHER.FETCHED, activeVouchers);
        } catch (error) {
            next(error);
        }
    }
};
