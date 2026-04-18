import * as rentalService from '../services/rental.service.js';

export const createRentalSpace = async (req, res, next) => {
  try {
    const space = await rentalService.createRentalSpace(req.user.vendorProfile.id, req.body);
    res.status(201).json({ success: true, data: space });
  } catch (error) {
    next(error);
  }
};

export const getRentalSpaceById = async (req, res, next) => {
  try {
    const space = await rentalService.getRentalSpaceById(req.params.id);
    if (!space) throw new ApiError(404, 'Rental space not found');
    res.status(200).json({ success: true, data: space });
  } catch (error) {
    next(error);
  }
};

export const updateRentalSpace = async (req, res, next) => {
  try {
    const space = await rentalService.getRentalSpaceById(req.params.id);
    if (!space || space.vendorId !== req.user.vendorProfile.id) {
       throw new ApiError(403, 'Forbidden');
    }
    const updated = await rentalService.updateRentalSpace(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteRentalSpace = async (req, res, next) => {
  try {
    const space = await rentalService.getRentalSpaceById(req.params.id);
    if (!space || space.vendorId !== req.user.vendorProfile.id) {
       throw new ApiError(403, 'Forbidden');
    }
    await rentalService.deleteRentalSpace(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const listRentalSpaces = async (req, res, next) => {
  try {
    const result = await rentalService.listRentalSpaces(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const vendorDashboard = async (req, res, next) => {
  try {
    const result = await rentalService.getVendorRentals(req.user.vendorProfile.id, req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const adminDashboard = async (req, res, next) => {
  try {
    const result = await rentalService.getAdminRentals(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
