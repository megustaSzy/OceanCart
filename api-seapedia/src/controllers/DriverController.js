import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { DriverService } from '../services/DriverService.js';
import { sendResponse } from '../utils/response.js';

export const DriverController = {
    async getJobs(req, res, next) {
        try {
            const data = await DriverService.getJobs(req.user.id);
            return sendResponse(res, HttpStatus.OK, MESSAGE.DRIVER.JOBS_FETCHED, data);
        } catch (error) {
            next(error);
        }
    },

    async takeJob(req, res, next) {
        try {
            const data = await DriverService.takeJob(req.user.id, req.body.orderId);
            return sendResponse(res, HttpStatus.OK, MESSAGE.DRIVER.JOB_TAKEN, data);
        } catch (error) {
            next(error);
        }
    },

    async completeJob(req, res, next) {
        try {
            const data = await DriverService.completeJob(req.user.id, req.body.orderId);
            return sendResponse(res, HttpStatus.OK, MESSAGE.DRIVER.JOB_COMPLETED, data);
        } catch (error) {
            next(error);
        }
    }
}

