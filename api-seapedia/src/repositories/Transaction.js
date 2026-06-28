import { prisma } from '../prisma/prisma.js';

export const executeTransaction = async (callback) => {
    return await prisma.$transaction(callback);
};
