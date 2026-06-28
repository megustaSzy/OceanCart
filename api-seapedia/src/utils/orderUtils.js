import { VoucherRepository } from '../repositories/VoucherRepository.js';

export const OrderUtils = {
    calculateSubtotalAndItems(cartItems) {
        let subtotal = 0;
        const orderItemsData = [];

        for (const item of cartItems) {
            const itemTotal = parseFloat(item.product.price) * item.quantity;
            subtotal += itemTotal;
            orderItemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price
            });
        }
        
        return { subtotal, orderItemsData };
    },

    async getDiscountAmount(voucherCode) {
        if (!voucherCode) return 0;

        const voucher = await VoucherRepository.findByCode(voucherCode);
        if (voucher && voucher.remainingUsage > 0 && new Date() < voucher.expiredAt) {
            return parseFloat(voucher.discount);
        }
        return 0;
    },

    calculateTotalPricing(subtotal, discount, deliveryFee = 10000) {
        const ppn = (subtotal - discount) * 0.11;
        const total = subtotal - discount + deliveryFee + ppn;
        return { deliveryFee, ppn, total };
    }
};
