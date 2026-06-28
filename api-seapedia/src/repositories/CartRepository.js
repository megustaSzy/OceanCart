import { prisma } from '../prisma/prisma.js';

export const CartRepository = {
    async findCart(buyerId, storeId) {
        return await prisma.cart.findFirst({
            where: { buyerId, storeId }
        });
    },

    async createCart(buyerId, storeId) {
        return await prisma.cart.create({
            data: { buyerId, storeId }
        });
    },

    async findItem(cartId, productId) {
        return await prisma.cartItem.findFirst({
            where: { cartId, productId }
        });
    },

    async findItemById(id) {
        return await prisma.cartItem.findUnique({
            where: { id: parseInt(id) },
            include: { cart: true }
        });
    },

    async createItem(data) {
        return await prisma.cartItem.create({ data });
    },

    async updateItemQuantity(id, quantity) {
        return await prisma.cartItem.update({
            where: { id: parseInt(id) },
            data: { quantity }
        });
    },

    async deleteItem(id) {
        return await prisma.cartItem.delete({
            where: { id: parseInt(id) }
        });
    },

    async deleteItemsByCartId(cartId, tx = prisma) {
        return await tx.cartItem.deleteMany({
            where: { cartId }
        });
    },
    
    async deleteCart(id, tx = prisma) {
        return await tx.cart.delete({
            where: { id }
        });
    },

    async getBuyerCarts(buyerId) {
        return await prisma.cart.findMany({
            where: { buyerId },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
    }
};
