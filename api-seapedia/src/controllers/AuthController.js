import { MESSAGE } from '../constants/message.js';
import { HttpStatus } from '../constants/http-status.js';
import { AuthService } from '../services/AuthService.js';
import { sendResponse } from '../utils/response.js';

export const AuthController = {
    async register(req, res, next) {
        try {
            const data = await AuthService.register(req.body);
            
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.cookie('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            const { accessToken, refreshToken, ...userData } = data;
            return sendResponse(res, HttpStatus.CREATED, MESSAGE.AUTH.REGISTER_SUCCESS, userData);
        } catch (error) {
            next(error);
        }
    },

    async login(req, res, next) {
        try {
            const data = await AuthService.login(req.body);

            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.cookie('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            const { accessToken, refreshToken, ...userData } = data;
            return sendResponse(res, HttpStatus.OK, MESSAGE.AUTH.LOGIN_SUCCESS, userData);
        } catch (error) {
            next(error);
        }
    },

    async selectRole(req, res, next) {
        try {
            const data = await AuthService.selectRole(req.user.id, req.body.role);
            return sendResponse(res, HttpStatus.OK, MESSAGE.AUTH.ROLE_SELECTED, data);
        } catch (error) {
            next(error);
        }
    },

    async profile(req, res, next) {
        try {
            return sendResponse(res, HttpStatus.OK, MESSAGE.AUTH.PROFILE_SUCCESS, req.user);
        } catch (error) {
            next(error);
        }
    },

    async refreshToken(req, res, next) {
        try {
            const token = req.cookies.refreshToken || req.body.refreshToken;
            const data = await AuthService.refreshToken(token);
            
            res.cookie('accessToken', data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });

            return sendResponse(res, HttpStatus.OK, 'Token refreshed successfully');
        } catch (error) {
            next(error);
        }
    },

    async logout(req, res, next) {
        try {
            const token = req.cookies.refreshToken || req.body.refreshToken;
            await AuthService.logout(token);
            
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            
            return sendResponse(res, HttpStatus.OK, MESSAGE.AUTH.LOGOUT_SUCCESS);
        } catch (error) {
            next(error);
        }
    }
}

