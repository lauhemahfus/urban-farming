import { Router } from 'express';
import {
    createVendorProfile,
    uploadCertification,
    getVendorProfile,
    updateVendorProfile,
    getPublicVendorProfile,
} from '../controllers/vendor.controller.js';
import { auth } from '../middlewares/auth.middleware.js';
import { role } from '../middlewares/role.middleware.js';
import upload from '../middlewares/upload.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { vendorRegisterSchema } from '../validations/vendor.validation.js';
import { uploadCertificationSchema } from '../validations/certification.validation.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: Vendor management
 */

/**
 * @swagger
 * /vendor/register:
 *   post:
 *     summary: Register as a vendor
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - farmName
 *               - description
 *               - farmLocation
 *               - contactNumber
 *             properties:
 *               farmName:
 *                 type: string
 *               description:
 *                 type: string
 *               farmLocation:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Vendor profile created successfully
 *       400:
 *         description: User already has a vendor profile
 *       401:
 *         description: Unauthorized
 */
router.post('/register', auth, role(['user', 'vendor']), validate(vendorRegisterSchema), createVendorProfile);

/**
 * @swagger
 * /vendor/profile:
 *   get:
 *     summary: Get vendor profile
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vendor profile not found
 */
router.get('/profile', auth, role(['vendor']), getVendorProfile);

/**
 * @swagger
 * /vendor/profile:
 *   patch:
 *     summary: Update vendor profile
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               farmName:
 *                 type: string
 *               description:
 *                 type: string
 *               farmLocation:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vendor profile updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vendor profile not found
 */
router.patch('/profile', auth, role(['vendor', 'admin']), updateVendorProfile);

/**
 * @swagger
 * /vendor/certification:
 *   post:
 *     summary: Upload certification document
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               certification:
 *                 type: string
 *                 format: binary
 *               certifyingAgency:
 *                 type: string
 *               certificationDate:
 *                 type: string
 *                 format: date-time
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Certification uploaded successfully
 *       400:
 *         description: Please upload a file
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vendor profile not found
 */
router.post('/certification', auth, role(['vendor']), upload.single('certification'), validate(uploadCertificationSchema), uploadCertification);

/**
 * @swagger
 * /vendor/{vendorId}/profile:
 *   get:
 *     summary: Get a specific vendor profile
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the vendor
 *     responses:
 *       200:
 *         description: Vendor profile
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Vendor profile not found
 */
router.get('/:vendorId/profile', auth, role(['user', 'vendor', 'admin']), getPublicVendorProfile);

export default router;
