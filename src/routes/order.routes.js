import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { auth as authenticate } from '../middlewares/auth.middleware.js';
import { role as authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validations/order.validation.js';
import { createLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and checkout
 */

router.use(authenticate);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List all orders for the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of orders
 */
router.get('/', orderController.listOrders);

/**
 * @swagger
 * /orders/dashboard/user:
 *   get:
 *     summary: User order dashboard statistics
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for recent orders list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Dashboard statistics for the user
 */
router.get('/dashboard/user', orderController.userDashboard);

/**
 * @swagger
 * /orders/dashboard/vendor:
 *   get:
 *     summary: Vendor order dashboard statistics
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for recent orders list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Dashboard statistics for the vendor
 */
router.get('/dashboard/vendor', authorize('vendor'), orderController.vendorDashboard);

/**
 * @swagger
 * /orders/dashboard/admin:
 *   get:
 *     summary: Admin order dashboard statistics
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for recent orders list
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Dashboard statistics for the admin
 */
router.get('/dashboard/admin', authorize('admin'), orderController.adminDashboard);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
router.get('/:id', orderController.getOrderById);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - totalAmount
 *               - shippingAddress
 *               - paymentMethod
 *               - items
 *             properties:
 *               totalAmount:
 *                 type: number
 *               shippingAddress:
 *                 type: string
 *               paymentMethod:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     produceId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *                     price:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/', createLimiter, validate(createOrderSchema), orderController.createOrder);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated
 */
router.put('/:id/status', validate(updateOrderStatusSchema), authorize('admin', 'vendor'), orderController.updateOrderStatus);

export default router;
