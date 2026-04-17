import { z } from 'zod';

export const uploadCertificationSchema = z.object({
    body: z.object({
        certifyingAgency: z.string().min(1, 'Certifying agency is required'),
        certificationDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format for certification date",
        }),
        expiryDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format for expiry date",
        }),
    }),
});
