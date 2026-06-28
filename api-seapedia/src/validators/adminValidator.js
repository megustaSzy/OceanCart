import { z } from 'zod';

export const AdminValidator = {
    createVoucher: z.object({
        code: z.string().min(3),
        discount: z.number().min(1),
        expiredAt: z.string().datetime("Must be a valid ISO Date string"),
        remainingUsage: z.number().min(1).optional()
    })
};
