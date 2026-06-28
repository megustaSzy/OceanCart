import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { CartService } from '../services/CartService.js';
import { sendResponse } from '../utils/response.js';

export const CartController = {
    async addToCart(req, res, next) {
        try {
            const data = await CartService.addToCart(req.user.id, req.body);
            return sendResponse(res, HttpStatus.OK, MESSAGE.CART.ADDED, data);
        } catch (error) {
            next(error);
        }
    },

    async getCart(req, res, next) {
        try {
            const data = await CartService.getCart(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.CART.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async updateCart(req, res, next) {
        try {
            const data = await CartService.updateCartItem(req.user.id, req.body);
            return sendResponse(res, HttpStatus.OK, MESSAGE.CART.UPDATED, data);
        } catch (error) {
            next(error);
        }
    },

    async deleteCart(req, res, next) {
        try {
            const data = await CartService.deleteCartItem(req.user.id, req.params.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.CART.DELETED, data);
        } catch (error) {
            next(error);
        }
    }
}

