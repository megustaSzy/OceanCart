import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { WalletService } from '../services/WalletService.js';
import { sendResponse } from '../utils/response.js';

export const WalletController = {
    async getWallet(req, res, next) {
        try {
            const data = await WalletService.getWallet(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.WALLET.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async getHistory(req, res, next) {
        try {
            const data = await WalletService.getHistory(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.WALLET.HISTORY_FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async topUp(req, res, next) {
        try {
            const data = await WalletService.topUp(req.user.id, req.body);
            return sendResponse(res, HttpStatus.OK, MESSAGE.WALLET.TOPUP_SUCCESS, data);
        } catch (error) {
            next(error);
        }
    }
}

