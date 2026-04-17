import { db as prisma } from '../config/prisma.js';

export const createProduce = async (vendorId, data) => {
  return prisma.produce.create({
    data: {
      ...data,
      vendorId
    }
  });
};

export const getProduceById = async (id) => {
  return prisma.produce.findUnique({
    where: { id },
    include: { vendor: true }
  });
};

export const updateProduce = async (id, data) => {
  return prisma.produce.update({
    where: { id },
    data
  });
};

export const deleteProduce = async (id) => {
  return prisma.produce.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'out_of_stock' }
  });
};

export const listProduce = async (query) => {
  const { page = 1, limit = 10, search, category, radius, lat, lng } = query;
  const skip = (page - 1) * limit;

  const where = { deletedAt: null };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (category) {
    where.category = category;
  }

  if (radius && lat && lng) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    const earthRadiusKm = 6371;
    const latDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI);
    const lngDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI) / Math.cos(latNum * (Math.PI / 180));

    where.vendor = {
      latitude: { gte: latNum - latDelta, lte: latNum + latDelta },
      longitude: { gte: lngNum - lngDelta, lte: lngNum + lngDelta }
    };
  }

  const [data, total] = await Promise.all([
    prisma.produce.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      include: {
        vendor: {
          select: { farmName: true, latitude: true, longitude: true }
        }
      }
    }),
    prisma.produce.count({ where })
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

export const getVendorDashboard = async (vendorId) => {
  return prisma.produce.findMany({
    where: { vendorId, deletedAt: null }
  });
};

export const getAdminDashboard = async () => {
    const totalProduce = await prisma.produce.count();
    const activeProduce = await prisma.produce.count({where:{status:'active'}});
    return {totalProduce, activeProduce};
}
