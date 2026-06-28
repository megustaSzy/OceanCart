import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { ProductService } from '../services/ProductService.js';
import { sendResponse } from '../utils/response.js';

export const ProductController = {
    async create(req, res, next) {
        try {
            const data = await ProductService.create(req.user.id, req.body);
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.PRODUCT.CREATED, data);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const data = await ProductService.getAll();
            return sendResponse(res, HttpStatus.OK, MESSAGE.PRODUCT.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const data = await ProductService.getById(req.params.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.PRODUCT.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await ProductService.update(req.params.id, req.user.id, req.body);
            return sendResponse(res, HttpStatus.OK, MESSAGE.PRODUCT.UPDATED, data);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            await ProductService.delete(req.params.id, req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.PRODUCT.DELETED);
        } catch (error) {
            next(error);
        }
    }
}

