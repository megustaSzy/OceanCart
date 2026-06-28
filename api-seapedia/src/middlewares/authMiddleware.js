import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { UnauthorizedError } from '../exceptions/UnauthorizedError.js';
import { MESSAGE } from '../constants/message.js';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma/prisma.js';

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return next(new UnauthorizedError(MESSAGE.AUTH.NO_TOKEN));
        }
        
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: { roles: { include: { role: true } } }
        });
        
        if (!user) {
            return next(new UnauthorizedError(MESSAGE.AUTH.TOKEN_INVALID));
        }
        
        req.user = user;
        next();
    } catch (error) {
        return next(new UnauthorizedError(MESSAGE.AUTH.TOKEN_INVALID));
    }
};

export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user.activeRole || !roles.includes(req.user.activeRole)) {
            return next(new ForbiddenError(MESSAGE.COMMON.FORBIDDEN));
        }
        next();
    };
};
