import { BadRequestError } from '../exceptions/BadRequestError.js';
import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { UnauthorizedError } from '../exceptions/UnauthorizedError.js';
import { MESSAGE } from '../constants/message.js';
import { AuthUtils } from '../utils/authUtils.js';
import { UserRepository, RoleRepository } from '../repositories/UserRepository.js';
import { TokenRepository } from '../repositories/TokenRepository.js';

export const AuthService = {
    async register({ name, username, email, password, roles }) {
        const existingUser = await UserRepository.findByEmailOrUsername(email, username);

        if (existingUser) {
            throw new BadRequestError(MESSAGE.USER.EMAIL_ALREADY_USED);
        }

        const hashedPassword = await AuthUtils.hashPassword(password);
        
        // Manual mapping because AuthUtils mapping required prisma
        const rolesData = await RoleRepository.findByNameIn(roles);
        const userRoles = rolesData.map(role => ({ roleId: role.id }));

        const user = await UserRepository.create({
            name,
            username,
            email,
            password: hashedPassword,
            roles: { create: userRoles },
            wallet: { create: { balance: 0 } }
        });

        const accessToken = AuthUtils.generateAccessToken(user.id);
        const refreshToken = AuthUtils.generateRefreshToken(user.id);
        await TokenRepository.create(user.id, refreshToken);

        return { 
            id: user.id, 
            name: user.name,
            accessToken,
            refreshToken
        };
    },

    async login({ email, password }) {
        const user = await UserRepository.findByEmail(email);

        if (!user || !(await AuthUtils.comparePassword(password, user.password))) {
            throw new UnauthorizedError(MESSAGE.AUTH.INVALID_CREDENTIALS);
        }

        const accessToken = AuthUtils.generateAccessToken(user.id);
        const refreshToken = AuthUtils.generateRefreshToken(user.id);
        await TokenRepository.create(user.id, refreshToken);

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            activeRole: user.activeRole,
            roles: user.roles,
            accessToken,
            refreshToken,
        };
    },

    async selectRole(userId, role) {
        const user = await UserRepository.findById(userId);

        const hasRole = user.roles.some(r => r.role.name === role);
        if (!hasRole) {
            throw new ForbiddenError(MESSAGE.AUTH.ROLE_NOT_FOUND);
        }

        await UserRepository.update(userId, { activeRole: role });

        return { activeRole: role };
    },

    async refreshToken(token) {
        if (!token) throw new UnauthorizedError(MESSAGE.AUTH.NO_TOKEN);

        const decoded = AuthUtils.verifyRefreshToken(token);
        if (!decoded) throw new UnauthorizedError(MESSAGE.AUTH.TOKEN_INVALID);

        const savedToken = await TokenRepository.findByToken(token);
        if (!savedToken) throw new UnauthorizedError(MESSAGE.AUTH.TOKEN_INVALID);

        const accessToken = AuthUtils.generateAccessToken(decoded.id);
        
        return { accessToken };
    },
    
    async logout(token) {
        if (token) {
            await TokenRepository.deleteByToken(token);
        }
        return { message: 'Logged out successfully' };
    }
};
