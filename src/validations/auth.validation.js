import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
        phone: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('Invalid email address'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),
});

export const vendorRegisterSchema = z.object({
    body: z.object({
        farmName: z.string().min(1, 'Farm name is required'),
        description: z.string().min(1, 'Description is required'),
        farmLocation: z.string().min(1, 'Farm location is required'),
        contactNumber: z.string().min(1, 'Contact number is required'),
    }),
});
