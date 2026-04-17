import { Router } from 'express';
import * as produceController from '../controllers/produce.controller.js';
import { auth as authenticate } from '../middlewares/auth.middleware.js';
import { role as authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createProduceSchema, updateProduceSchema } from '../validations/produce.validation.js';
import { createLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Produce
 *   description: Produce management and listing
 */

/**
 * @swagger
 * /produce:
 *   get:
 *     summary: List all produce
 *     tags: [Produce]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by produce name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *         description: Search radius in kilometers
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for radius search
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Longitude for radius search
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Results per page
 *     responses:
 *       200:
 *         description: A list of produce
 */
router.get('/', produceController.listProduce);

/**
 * @swagger
 * /produce/dashboard/admin:
 *   get:
 *     summary: Get produce dashboard for admin
 *     tags: [Produce]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics for admin
 */
router.get('/dashboard/admin', authenticate, authorize('admin'), produceController.adminDashboard);

/**
 * @swagger
 * /produce/dashboard/vendor:
 *   get:
 *     summary: Get produce dashboard for vendor
 *     tags: [Produce]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics for vendor
 */
router.get('/dashboard/vendor', authenticate, authorize('vendor'), produceController.vendorDashboard);

/**
 * @swagger
 * /produce:
 *   post:
 *     summary: Create a new produce
 *     tags: [Produce]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - unit
 *               - availableQuantity
 *               - certificationStatus
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *                 enum: [kg, g, liters, pieces, bunch]
 *               availableQuantity:
 *                 type: integer
 *               isOrganic:
 *                 type: boolean
 *               certificationStatus:
 *                 type: string
 *                 enum: [pending, approved, rejected]
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Produce created successfully
 */
router.post('/', authenticate, authorize('vendor'), createLimiter, validate(createProduceSchema), produceController.createProduce);

/**
 * @swagger
 * /produce/{id}:
 *   get:
 *     summary: Get produce by ID
 *     tags: [Produce]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Produce ID
 *     responses:
 *       200:
 *         description: Produce details
 *       404:
 *         description: Produce not found
 */
router.get('/:id', produceController.getProduceById);

/**
 * @swagger
 * /produce/{id}:
 *   put:
 *     summary: Update produce by ID
 *     tags: [Produce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Produce ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               unit:
 *                 type: string
 *               availableQuantity:
 *                 type: integer
 *               isOrganic:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [active, out_of_stock]
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produce updated successfully
 */
router.put('/:id', authenticate, authorize('vendor'), validate(updateProduceSchema), produceController.updateProduce);

/**
 * @swagger
 * /produce/{id}:
 *   delete:
 *     summary: Delete a produce (soft delete)
 *     tags: [Produce]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Produce ID
 *     responses:
 *       204:
 *         description: Produce deleted successfully
 */
router.delete('/:id', authenticate, authorize('vendor'), produceController.deleteProduce);

export default router;
