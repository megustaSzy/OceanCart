import { HttpStatus } from '../constants/http-status.js';
import { MESSAGE } from '../constants/message.js';
import { AddressService } from '../services/AddressService.js';
import { sendResponse } from '../utils/response.js';

export const AddressController = {
    async create(req, res, next) {
        try {
            const data = await AddressService.create(req.user.id, req.body);
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.ADDRESS.CREATED, data);
        } catch (error) {
            next(error);
        }
    },

    async getAll(req, res, next) {
        try {
            const data = await AddressService.getAll(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ADDRESS.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const data = await AddressService.getById(req.user.id, req.params.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ADDRESS.FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const data = await AddressService.update(req.user.id, req.params.id, req.body);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ADDRESS.UPDATED, data);
        } catch (error) {
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            await AddressService.delete(req.user.id, req.params.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.ADDRESS.DELETED);
        } catch (error) {
            next(error);
        }
    }
};
