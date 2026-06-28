import { z } from 'zod';

export const ProductValidator = {
    create: z.object({
        name: z.string().min(3, "Product name is required"),
        description: z.string().optional(),
        price: z.number().min(1, "Price must be greater than 0"),
        stock: z.number().min(0, "Stock cannot be negative"),
        image: z.string().url("Image must be a valid URL").optional()
    }),

    update: z.object({
        name: z.string().min(3).optional(),
        description: z.string().optional(),
        price: z.number().min(1).optional(),
        stock: z.number().min(0).optional(),
        image: z.string().url().optional()
    })
};
