import { z } from 'zod';

export const OrderValidator = {
    checkout: z.object({
        deliveryMethod: z.enum(['Instant', 'NextDay', 'Regular']).optional(),
        voucherCode: z.string().optional()
    }),

    updateStatus: z.object({
        status: z.enum(['Sedang_Dikemas', 'Menunggu_Pengirim', 'Sedang_Dikirim', 'Pesanan_Selesai', 'Dikembalikan'])
    })
};
