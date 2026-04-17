import { db as prisma } from '../config/prisma.js';
import { NotFoundError } from '../utils/errors.js';
import { registerVendor } from '../services/vendor.service.js';

export const createVendorProfile = async (req, res, next) => {
    try {
        const vendorProfile = await registerVendor(req.user.id, req.body);
        res.status(201).json({
            success: true,
            message: 'Vendor profile created successfully',
            vendorProfile,
        });
    } catch (error) {
        next(error);
    }
};

export const getVendorProfile = async (req, res, next) => {
    try {
        const vendorProfile = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                certificationDocuments: true,
                produce: true,
                rentalSpaces: true,
            }
        });

        if (!vendorProfile) {
            throw new NotFoundError('Vendor profile not found');
        }

        res.status(200).json(vendorProfile);
    } catch (error) {
        next(error);
    }
};

export const updateVendorProfile = async (req, res, next) => {
    try {
        const { farmName, description, farmLocation, contactNumber } = req.body;
        const vendorProfile = await prisma.vendorProfile.update({
            where: { userId: req.user.id },
            data: {
                farmName,
                description,
                farmLocation,
                contactNumber,
            },
        });
        res.status(200).json(vendorProfile);
    } catch (error) {
        if (error.code === 'P2025') {
            return next(new NotFoundError('Vendor profile not found'));
        }
        next(error);
    }
};

export const uploadCertification = async (req, res, next) => {
    try {
        const { certifyingAgency, certificationDate, expiryDate } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const vendorProfile = await prisma.vendorProfile.findUnique({
            where: { userId: req.user.id },
        });

        if (!vendorProfile) {
            throw new NotFoundError('Vendor profile not found');
        }

        const sustainabilityCert = await prisma.sustainabilityCert.create({
            data: {
                vendorId: vendorProfile.id,
                certifyingAgency,
                certificateFile: req.file.path,
                certificationDate: new Date(certificationDate),
                expiryDate: new Date(expiryDate),
            },
        });

        res.status(201).json({
            message: 'Certification uploaded successfully',
            document: sustainabilityCert,
        });
    } catch (error) {
        next(error);
    }
};

export const getPublicVendorProfile = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const vendorProfile = await prisma.vendorProfile.findUnique({
            where: { id: vendorId },
            include: {
                produce: true,
                rentalSpaces: true,
            }
        });

        if (!vendorProfile) {
            throw new NotFoundError('Vendor profile not found');
        }

        res.status(200).json(vendorProfile);
    } catch (error) {
        next(error);
    }
};
