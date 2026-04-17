import * as produceService from '../services/produce.service.js';

export const createProduce = async (req, res, next) => {
  try {
    const produce = await produceService.createProduce(req.user.vendorProfile.id, req.body);
    res.status(201).json({ success: true, data: produce });
  } catch (error) {
    next(error);
  }
};

export const getProduceById = async (req, res, next) => {
  try {
    const produce = await produceService.getProduceById(req.params.id);
    if (!produce) throw new ApiError(404, 'Produce not found');
    res.status(200).json({ success: true, data: produce });
  } catch (error) {
    next(error);
  }
};

export const updateProduce = async (req, res, next) => {
  try {
    const produce = await produceService.getProduceById(req.params.id);
    if (!produce || produce.vendorId !== req.user.vendorProfile.id) {
       throw new ApiError(403, 'Forbidden');
    }
    const updated = await produceService.updateProduce(req.params.id, req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteProduce = async (req, res, next) => {
  try {
    const produce = await produceService.getProduceById(req.params.id);
    if (!produce || produce.vendorId !== req.user.vendorProfile.id) {
       throw new ApiError(403, 'Forbidden');
    }
    await produceService.deleteProduce(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const listProduce = async (req, res, next) => {
  try {
    const result = await produceService.listProduce(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const vendorDashboard = async (req, res, next) => {
  try {
    const result = await produceService.getVendorDashboard(req.user.vendorProfile.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminDashboard = async (req, res, next) => {
  try {
    const result = await produceService.getAdminDashboard();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
