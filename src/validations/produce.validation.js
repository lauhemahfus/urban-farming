import { z } from 'zod';

export const createProduceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.number().positive('Price must be a positive number'),
    unit: z.string().min(1, 'Unit is required'),
    availableQuantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
    isOrganic: z.boolean().optional(),
    certificationStatus: z.string().min(1, 'Certification status is required'),
    status: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL').optional()
  })
});

export const updateProduceSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name cannot be empty').optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    unit: z.string().min(1, 'Unit cannot be empty').optional(),
    availableQuantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative').optional(),
    isOrganic: z.boolean().optional(),
    certificationStatus: z.string().min(1, 'Certification status cannot be empty').optional(),
    status: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL').optional()
  })
});
