import { db as prisma } from '../config/prisma.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export const createOrder = async (userId, data) => {
  const { shippingAddress, paymentMethod, items } = data;
  let totalAmount = 0;

  const orderItems = [];
  for (const item of items) {
    const produce = await prisma.produce.findUnique({ where: { id: item.produceId } });
    if (!produce) {
      throw new NotFoundError(`Produce ${item.produceId} not found`);
    }
    if (produce.availableQuantity < item.quantity) {
      throw new BadRequestError(`Not enough quantity for produce ${produce.name}`);
    }
    const price = produce.price * item.quantity;
    totalAmount += price;

    orderItems.push({
      produceId: produce.id,
      quantity: item.quantity,
      price: produce.price
    });
  }

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        shippingAddress,
        paymentMethod,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: { items: true }
    });

    for (const item of items) {
      await tx.produce.update({
        where: { id: item.produceId },
        data: {
          availableQuantity: { decrement: item.quantity }
        }
      });
    }

    return createdOrder;
  });

  return order;
};

export const getOrderById = async (id, userId, role, vendorId) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { produce: true }
      }
    }
  });

  if (!order) return null;

  if (role === 'admin') return order;
  if (role === 'user' && order.userId === userId) return order;

  if (role === 'vendor' && vendorId) {
    const hasVendorProduce = order.items.some(item => item.produce.vendorId === vendorId);
    if (hasVendorProduce) return order;
  }

  return null;
};

export const updateOrderStatus = async (id, data, role, vendorId) => {
    return prisma.order.update({
        where: { id },
        data
    });
};

export const listOrders = async (query, userId, role, vendorId) => {
  const { page = 1, limit = 10, status } = query;
  const skip = (page - 1) * limit;

  const where = {};
  if (status) where.status = status;

  if (role === 'user') {
    where.userId = userId;
  } else if (role === 'vendor') {
    where.items = {
      some: { produce: { vendorId } }
    };
  }

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      include: {
        items: { include: { produce: { select: { name: true, vendorId: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.order.count({ where })
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

export const getUserDashboard = async (userId) => {
  const orders = await prisma.order.count({ where: { userId } });
  return { totalOrders: orders };
};

export const getVendorDashboard = async (vendorId) => {
  const orders = await prisma.order.count({
    where: {
      items: { some: { produce: { vendorId } } }
    }
  });
  return { totalOrdersWithYourProduce: orders };
};

export const getAdminDashboard = async () => {
    return prisma.order.count();
};
