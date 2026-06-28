import { HttpStatus } from '../constants/http-status.js';
import { MESSAGE } from '../constants/message.js';
import { ReviewService } from '../services/ReviewService.js';
import { sendResponse } from '../utils/response.js';

export const ReviewController = {
    async create(req, res, next) {
        try {
            const data = await ReviewService.create(req.user.id, req.body);
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.REVIEW.CREATED, data);
        } catch (error) {
            next(error);
        }
    },

    async getByProduct(req, res, next) {
        try {
            const data = await ReviewService.getByProductId(req.params.productId);
            return sendResponse(res, HttpStatus.OK, MESSAGE.REVIEW.FETCHED, data);
        } catch (error) {
            next(error);
        }
    }
};
