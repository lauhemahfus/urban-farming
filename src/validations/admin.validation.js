import { z } from 'zod';

export const updateStatusSchema = z.object({
    params: z.object({
        vendorId: z.string().uuid().optional(),
        certificateId: z.string().uuid().optional(),
    }),
    body: z.object({
        status: z.enum(['pending', 'approved', 'rejected'], {
            errorMap: () => ({ message: 'Status must be pending, approved, or rejected' }),
        }),
    }),
});