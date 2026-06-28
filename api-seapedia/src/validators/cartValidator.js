import { z } from 'zod';

export const CartValidator = {
    addToCart: z.object({
        productId: z.number().or(z.string().transform(Number)),
        quantity: z.number().min(1, "Quantity must be at least 1")
    }),

    updateItem: z.object({
        quantity: z.number().min(1, "Quantity must be at least 1")
    })
};
