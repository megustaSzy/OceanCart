import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { StoreService } from '../services/StoreService.js';
import { sendResponse } from '../utils/response.js';

export const StoreController = {
    async create(req, res, next) {
        try {
            const data = await StoreService.create(req.user.id, req.body);
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.STORE.CREATED, data);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const data = await StoreService.getAll();
            return sendResponse(res, HttpStatus.OK, MESSAGE.STORE.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const data = await StoreService.getById(req.params.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.STORE.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await StoreService.update(req.params.id, req.user.id, req.body);
            return sendResponse(res, HttpStatus.OK, MESSAGE.STORE.UPDATED, data);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            await StoreService.delete(req.params.id, req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.STORE.DELETED);
        } catch (error) {
            next(error);
        }
    },

    async getRevenueReport(req, res, next) {
        try {
            const data = await StoreService.getRevenueReport(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.STORE.REVENUE_FETCHED, data);
        } catch (error) {
            next(error);
        }
    }
}
