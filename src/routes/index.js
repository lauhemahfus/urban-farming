import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import vendorRoutes from './vendor.routes.js';
import produceRoutes from './produce.routes.js';
import rentalRoutes from './rental.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/vendor', vendorRoutes);
router.use('/produce', produceRoutes);
router.use('/rentals', rentalRoutes);
router.use('/orders', orderRoutes);

export default router;
