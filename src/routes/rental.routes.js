import { Router } from 'express';
import * as rentalController from '../controllers/rental.controller.js';
import { auth as authenticate } from '../middlewares/auth.middleware.js';
import { role as authorize } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { createRentalSchema, updateRentalSchema } from '../validations/rental.validation.js';
import { createLimiter } from '../middlewares/rateLimit.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: RentalSpace
 *   description: Rental space management and listing
 */

/**
 * @swagger
 * /rentals:
 *   get:
 *     summary: List all rental spaces
 *     tags: [RentalSpace]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by location, area name, or description
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
 *         description: A list of rental spaces
 */
router.get('/', rentalController.listRentalSpaces);

/**
 * @swagger
 * /rentals/dashboard/vendor:
 *   get:
 *     summary: Get vendor dashboard for rental spaces
 *     tags: [RentalSpace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for recent rental spaces
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Dashboard statistics for vendor
 */
router.get('/dashboard/vendor', authenticate, authorize('vendor'), rentalController.vendorDashboard);

/**
 * @swagger
 * /rentals/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard for rental spaces
 *     tags: [RentalSpace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for recent rental spaces
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Dashboard statistics for admin
 */
router.get('/dashboard/admin', authenticate, authorize('admin'), rentalController.adminDashboard);

/**
 * @swagger
 * /rentals:
 *   post:
 *     summary: Create a new rental space
 *     tags: [RentalSpace]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - size
 *               - price
 *               - rentalDurationInDays
 *               - waterAvailability
 *               - sunlightHours
 *             properties:
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               rentalDurationInDays:
 *                 type: integer
 *               waterAvailability:
 *                 type: boolean
 *               sunlightHours:
 *                 type: integer
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rental space created successfully
 */
router.post('/', authenticate, authorize('vendor'), createLimiter, validate(createRentalSchema), rentalController.createRentalSpace);

/**
 * @swagger
 * /rentals/{id}:
 *   get:
 *     summary: Get rental space by ID
 *     tags: [RentalSpace]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental space ID
 *     responses:
 *       200:
 *         description: Rental space details
 *       404:
 *         description: Rental space not found
 */
router.get('/:id', rentalController.getRentalSpaceById);

/**
 * @swagger
 * /rentals/{id}:
 *   put:
 *     summary: Update rental space by ID
 *     tags: [RentalSpace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental space ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               size:
 *                 type: string
 *               price:
 *                 type: number
 *               availability:
 *                 type: string
 *                 enum: [active, unavailable]
 *               rentalDurationInDays:
 *                 type: integer
 *               waterAvailability:
 *                 type: boolean
 *               sunlightHours:
 *                 type: integer
 *               description:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rental space updated successfully
 */
router.put('/:id', authenticate, authorize('vendor'), validate(updateRentalSchema), rentalController.updateRentalSpace);

/**
 * @swagger
 * /rentals/{id}:
 *   delete:
 *     summary: Delete a rental space (soft delete)
 *     tags: [RentalSpace]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental space ID
 *     responses:
 *       204:
 *         description: Rental space deleted successfully
 */
router.delete('/:id', authenticate, authorize('vendor'), rentalController.deleteRentalSpace);

export default router;
