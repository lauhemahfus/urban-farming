import { db as prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';

export const getVendors = async () => {
    return prisma.vendorProfile.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                }
            },
            sustainabilityCerts: true,
        }
    });
};

export const updateVendorStatus = async (vendorId, status) => {
    try {
        return await prisma.vendorProfile.update({
            where: { id: vendorId },
            data: { vendorStatus: status },
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError('Vendor not found');
        }
        throw error;
    }
};

export const updateCertificationStatus = async (certificateId, status) => {
    try {
        return await prisma.sustainabilityCert.update({
            where: { id: certificateId },
            data: { status },
        });
    } catch (error) {
        if (error.code === 'P2025') {
            throw new NotFoundError('Certificate not found');
        }
        throw error;
    }
};
