import { z } from 'zod';

export const ReviewValidator = {
    create: z.object({
        productId: z.number().or(z.string().transform(Number)),
        rating: z.number().min(1).max(5),
        comment: z.string().min(5, "Comment must be at least 5 characters")
    })
};
