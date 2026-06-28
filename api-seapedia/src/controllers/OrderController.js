import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { OrderService } from '../services/OrderService.js';
import { sendResponse } from '../utils/response.js';

export const OrderController = {
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

