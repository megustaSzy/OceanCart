import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const AuthUtils = {
    async hashPassword(password) {
        return await bcrypt.hash(password, 10);
    },

    async comparePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    },

    generateAccessToken(userId) {
        if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: '15m' // Best practice: short-lived access token
        });
    },

    generateRefreshToken(userId) {
        if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined");
        return jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: '7d' // Best practice: long-lived refresh token
        });
    },

    verifyRefreshToken(token) {
        try {
            if (!process.env.JWT_REFRESH_SECRET) throw new Error("JWT_REFRESH_SECRET is not defined");
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        } catch (error) {
            return null;
        }
    },

    async mapRolesToIds(roles, prisma) {
        const rolesData = await prisma.role.findMany({
            where: { name: { in: roles } }
        });
        return rolesData.map(role => ({ roleId: role.id }));
    }
};
