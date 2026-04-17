import {
    getVendors as getVendorsService,
    updateVendorStatus as updateVendorStatusService,
    updateCertificationStatus as updateCertificationStatusService,
} from '../services/admin.service.js';

export const getVendors = async (req, res, next) => {
    try {
        const vendors = await getVendorsService();
        res.status(200).json(vendors);
    } catch (error) {
        next(error);
    }
};

export const updateVendorStatus = async (req, res, next) => {
    try {
        const { vendorId } = req.params;
        const { status } = req.body;
        const vendor = await updateVendorStatusService(vendorId, status);
        res.status(200).json(vendor);
    } catch (error) {
        next(error);
    }
};

export const updateCertificationStatus = async (req, res, next) => {
    try {
        const { certificateId } = req.params;
        const { status } = req.body;
        const cert = await updateCertificationStatusService(certificateId, status);
        res.status(200).json(cert);
    } catch (error) {
        next(error);
    }
};
