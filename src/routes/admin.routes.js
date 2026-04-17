import { Router } from 'express';
import {
    getVendors,
    updateVendorStatus,
    updateCertificationStatus,
} from '../controllers/admin.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { role } from '../middlewares/role.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { updateStatusSchema } from '../validations/admin.validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management
 */

/**
 * @swagger
 * /admin/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of vendors
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/vendors', auth, role(['admin']), getVendors);

/**
 * @swagger
 * /admin/vendors/{vendorId}/status:
 *   patch:
 *     summary: Update a vendor's status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Vendor status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vendor not found
 */
router.patch('/vendors/:vendorId/status', auth, role(['admin']), validate(updateStatusSchema), updateVendorStatus);

/**
 * @swagger
 * /admin/certificate/{certificateId}/status:
 *   patch:
 *     summary: Update a certification's status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         schema:
 *           type: string
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
 *                 enum: [pending, approved, rejected]
 *     responses:
 *       200:
 *         description: Certification status updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Certificate not found
 */
router.patch('/certificate/:certificateId/status', auth, role(['admin']), validate(updateStatusSchema), updateCertificationStatus);

export default router;
