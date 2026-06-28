import { prisma } from '../prisma/prisma.js';

export const UserRepository = {
    async findByEmailOrUsername(email, username) {
        return await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });
    },

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email },
            include: { roles: { include: { role: true } } }
        });
    },

    async findById(id) {
        return await prisma.user.findUnique({
            where: { id },
            include: { roles: { include: { role: true } } }
        });
    },

    async create(data) {
        return await prisma.user.create({ data });
    },

    async update(id, data) {
        return await prisma.user.update({
            where: { id },
            data
        });
    }
};

export const RoleRepository = {
    async findByNameIn(roles) {
        return await prisma.role.findMany({
            where: { name: { in: roles } }
        });
    }
};
