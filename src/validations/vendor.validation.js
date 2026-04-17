import { z } from 'zod';

export const vendorRegisterSchema = z.object({
    body: z.object({
        farmName: z.string().min(1, 'Farm name is required'),
        description: z.string().min(1, 'Description is required'),
        farmLocation: z.string().min(1, 'Farm location is required'),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
        contactNumber: z.string().min(1, 'Contact number is required'),
    }),
});