import { NotFoundError } from '../exceptions/NotFoundError.js';
import { MESSAGE } from '../constants/message.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { CartRepository } from '../repositories/CartRepository.js';

export const CartService = {
    async addToCart(buyerId, { productId, quantity }) {
        const product = await ProductRepository.findById(productId);
        if (!product) throw new NotFoundError(MESSAGE.PRODUCT.NOT_FOUND);

        let cart = await CartRepository.findCart(buyerId, product.storeId);
        if (!cart) {
            cart = await CartRepository.createCart(buyerId, product.storeId);
        }

        const existingItem = await CartRepository.findItem(cart.id, product.id);

        if (existingItem) {
            await CartRepository.updateItemQuantity(existingItem.id, existingItem.quantity + quantity);
        } else {
            await CartRepository.createItem({
                cartId: cart.id,
                productId: product.id,
                quantity
            });
        }

        return await this.getCart(buyerId);
    },

    async getCart(buyerId) {
        return await CartRepository.getBuyerCarts(buyerId);
    },

    async updateCartItem(buyerId, { cartItemId, quantity }) {
        const item = await CartRepository.findItemById(cartItemId);
        if (!item || item.cart.buyerId !== buyerId) {
            throw new NotFoundError(MESSAGE.CART.NOT_FOUND);
        }

        await CartRepository.updateItemQuantity(cartItemId, quantity);

        return await this.getCart(buyerId);
    },

    async deleteCartItem(buyerId, cartItemId) {
        const item = await CartRepository.findItemById(cartItemId);
        if (!item || item.cart.buyerId !== buyerId) {
            throw new NotFoundError(MESSAGE.CART.NOT_FOUND);
        }

        await CartRepository.deleteItem(cartItemId);

        return await this.getCart(buyerId);
    }
};
