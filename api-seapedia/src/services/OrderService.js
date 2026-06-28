import { BadRequestError } from '../exceptions/BadRequestError.js';
import { ForbiddenError } from '../exceptions/ForbiddenError.js';
import { NotFoundError } from '../exceptions/NotFoundError.js';
import { MESSAGE } from '../constants/message.js';
import { OrderUtils } from '../utils/orderUtils.js';
import { CartRepository } from '../repositories/CartRepository.js';
import { WalletRepository } from '../repositories/WalletRepository.js';
import { OrderRepository } from '../repositories/OrderRepository.js';
import { StoreRepository } from '../repositories/StoreRepository.js';
import { VoucherRepository } from '../repositories/VoucherRepository.js';
import { ProductRepository } from '../repositories/ProductRepository.js';
import { executeTransaction } from '../repositories/Transaction.js';

export const OrderService = {
    async checkout(buyerId, { deliveryMethod, voucherCode }) {
        const carts = await CartRepository.getBuyerCarts(buyerId);

        if (carts.length === 0) throw new BadRequestError(MESSAGE.CART.EMPTY);

        const orders = [];

        for (const cart of carts) {
            const { subtotal, orderItemsData } = OrderUtils.calculateSubtotalAndItems(cart.items);
            const discount = await OrderUtils.getDiscountAmount(voucherCode);
            const { deliveryFee, ppn, total } = OrderUtils.calculateTotalPricing(subtotal, discount);

            const wallet = await WalletRepository.findByUserId(buyerId);
            if (!wallet || parseFloat(wallet.balance) < total) {
                throw new BadRequestError(MESSAGE.WALLET.INSUFFICIENT_BALANCE);
            }

            await executeTransaction(async (tx) => {
                // Deduct balance
                await WalletRepository.decrementBalance(buyerId, total, tx);

                // Create Order
                const order = await OrderRepository.createOrder({
                    buyerId,
                    storeId: cart.storeId,
                    subtotal,
                    discount,
                    deliveryFee,
                    ppn,
                    total,
                    status: 'Sedang_Dikemas',
                    deliveryMethod: deliveryMethod || 'Regular',
                    items: { create: orderItemsData },
                    histories: { create: [{ status: 'Sedang_Dikemas' }] }
                }, tx);
                
                orders.push(order);

                // Clear Cart
                await CartRepository.deleteItemsByCartId(cart.id, tx);
                await CartRepository.deleteCart(cart.id, tx);

                // Deduct Product Stock
                for (const item of cart.items) {
                    await ProductRepository.updateStock(item.productId, -item.quantity, tx);
                }

                // Deduct Voucher Usage
                if (discount > 0 && voucherCode) {
                    await VoucherRepository.decrementUsage(voucherCode, tx);
                }
            });
        }

        return orders;
    },

    async getBuyerOrders(buyerId) {
        return await OrderRepository.findByBuyerId(buyerId);
    },

    async getOrderById(orderId, userId, role) {
        const order = await OrderRepository.findById(orderId);
        if (!order) throw new NotFoundError(MESSAGE.ORDER.NOT_FOUND);

        // Security check
        if (role === 'BUYER' && order.buyerId !== userId) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        } else if (role === 'SELLER') {
            const store = await StoreRepository.findBySellerId(userId);
            if (!store || order.storeId !== store.id) {
                throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
            }
        }
        
        return order;
    },

    async getSellerOrders(sellerId) {
        const store = await StoreRepository.findBySellerId(sellerId);
        if (!store) throw new NotFoundError(MESSAGE.STORE.NOT_FOUND);

        return await OrderRepository.findByStoreId(store.id);
    },

    async updateStatus(orderId, sellerId, status) {
        const [store, order] = await Promise.all([
            StoreRepository.findBySellerId(sellerId),
            OrderRepository.findById(orderId)
        ]);

        if (!store || !order || order.storeId !== store.id) {
            throw new ForbiddenError(MESSAGE.COMMON.FORBIDDEN);
        }

        return await executeTransaction(async (tx) => {
            const [updatedOrder] = await Promise.all([
                OrderRepository.updateStatus(orderId, status, undefined, tx),
                OrderRepository.createHistory(orderId, status, tx)
            ]);
            return updatedOrder;
        });
    }
};
