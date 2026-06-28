import { z } from 'zod';

export const WalletValidator = {
    topUp: z.object({
        amount: z.number().min(1000, "Minimum top up is 1000"),
        description: z.string().optional()
    })
};
