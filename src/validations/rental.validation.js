import { z } from 'zod';

export const createRentalSchema = z.object({
  body: z.object({
    location: z.string().min(1, 'Location is required'),
    latitude: z.number().min(-90, 'Latitude must be at least -90').max(90, 'Latitude must be at most 90').optional(),
    longitude: z.number().min(-180, 'Longitude must be at least -180').max(180, 'Longitude must be at most 180').optional(),
    size: z.string().min(1, 'Size is required'),
    price: z.number().positive('Price must be a positive number'),
    rentalDurationInDays: z.number().int('Rental duration must be an integer').min(1, 'Rental duration must be at least 1 day'),
    waterAvailability: z.boolean({ required_error: 'Water availability status is required' }),
    sunlightHours: z.number().int('Sunlight hours must be an integer').min(0, 'Cannot be less than 0').max(24, 'Cannot exceed 24 hours'),
    description: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL').optional(),
  })
});

export const updateRentalSchema = z.object({
  body: z.object({
    location: z.string().min(1, 'Location cannot be empty').optional(),
    latitude: z.number().min(-90, 'Latitude must be at least -90').max(90, 'Latitude must be at most 90').optional(),
    longitude: z.number().min(-180, 'Longitude must be at least -180').max(180, 'Longitude must be at most 180').optional(),
    size: z.string().min(1, 'Size cannot be empty').optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    rentalDurationInDays: z.number().int('Rental duration must be an integer').min(1, 'Rental duration must be at least 1 day').optional(),
    waterAvailability: z.boolean().optional(),
    sunlightHours: z.number().int('Sunlight hours must be an integer').min(0, 'Cannot be less than 0').max(24, 'Cannot exceed 24 hours').optional(),
    description: z.string().optional(),
    imageUrl: z.string().url('Must be a valid URL').optional(),
    availability: z.enum(['active', 'booked'], { invalid_type_error: 'Availability must be active or booked' }).optional(),
  })
});
