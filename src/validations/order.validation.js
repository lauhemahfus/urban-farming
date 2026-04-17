import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: z.string().min(1, 'Shipping address is required'),
    paymentMethod: z.enum(['cod', 'card', 'mobile_banking'], { 
      invalid_type_error: 'Payment method must be cod, card, or mobile_banking'
    }).default('cod'),
    items: z.array(
      z.object({
        produceId: z.string().uuid('Invalid produce ID provided'),
        quantity: z.number().int('Quantity must be an integer').min(1, 'Quantity must be at least 1')
      })
    ).min(1, 'At least one item is required to place an order')
  })
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'shipped', 'delivered', 'cancelled'], {
      invalid_type_error: 'Status must be pending, shipped, delivered, or cancelled'
    }).optional(),
    paymentStatus: z.enum(['pending', 'paid', 'failed'], {
      invalid_type_error: 'Payment status must be pending, paid, or failed'
    }).optional(),
  })
});
