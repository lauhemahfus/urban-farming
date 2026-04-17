import { db as prisma } from '../config/prisma.js';
import { BadRequestError } from '../utils/errors.js';

export const registerVendor = async (userId, vendorData) => {
    const { farmName, description, farmLocation, latitude, longitude, contactNumber } = vendorData;

    const existingVendorProfile = await prisma.vendorProfile.findUnique({
        where: { userId },
    });

    if (existingVendorProfile) {
        throw new BadRequestError('User already has a vendor profile.');
    }

    const vendorProfile = await prisma.vendorProfile.create({
        data: {
            user: {
                connect: { id: userId },
            },
            farmName,
            description,
            farmLocation,
            latitude,
            longitude,
            contactNumber,
        },
    });

    await prisma.user.update({
        where: { id: userId },
        data: { role: 'vendor' },
    });

    return vendorProfile;
};
