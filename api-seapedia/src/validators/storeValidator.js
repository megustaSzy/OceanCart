import { z } from 'zod';

export const StoreValidator = {
    create: z.object({
        storeName: z.string().min(3, "Store name must be at least 3 characters"),
        description: z.string().optional(),
        logo: z.string().url("Logo must be a valid URL").optional()
    }),

    update: z.object({
        storeName: z.string().min(3).optional(),
        description: z.string().optional(),
        logo: z.string().url().optional()
    })
};
