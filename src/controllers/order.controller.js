import * as orderService from '../services/order.service.js';


export const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.user.id, req.body);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id,
      req.user.role,
      req.user.vendorProfile?.id
    );
    if (!order) throw new ApiError(404, 'Order not found or unauthorized');
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(
        req.params.id,
        req.user.id,
        req.user.role,
        req.user.vendorProfile?.id
    );
    if (!order) throw new ApiError(403, 'Forbidden');
    
    // Simplistic update for admin or vendor to manage orders
    if (req.user.role !== 'admin' && req.user.role !== 'vendor') {
        throw new ApiError(403, 'Users cannot update order status');
    }

    const updated = await orderService.updateOrderStatus(req.params.id, req.body, req.user.role, req.user.vendorProfile?.id);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (req, res, next) => {
  try {
    const result = await orderService.listOrders(
      req.query,
      req.user.id,
      req.user.role,
      req.user.vendorProfile?.id
    );
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const userDashboard = async (req, res, next) => {
  try {
    const result = await orderService.getUserDashboard(req.user.id, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const vendorDashboard = async (req, res, next) => {
  try {
    const result = await orderService.getVendorDashboard(req.user.vendorProfile.id, req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const adminDashboard = async (req, res, next) => {
  try {
    const result = await orderService.getAdminDashboard(req.query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
