import { z } from 'zod';

export const AddressValidator = {
    create: z.object({
        receiverName: z.string().min(3),
        phone: z.string().min(9),
        address: z.string().min(10),
        city: z.string().min(3),
        postalCode: z.string().min(4)
    }),

    update: z.object({
        receiverName: z.string().min(3).optional(),
        phone: z.string().min(9).optional(),
        address: z.string().min(10).optional(),
        city: z.string().min(3).optional(),
        postalCode: z.string().min(4).optional()
    })
};
