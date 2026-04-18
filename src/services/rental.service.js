import { db as prisma } from '../config/prisma.js';

export const createRentalSpace = async (vendorId, data) => {
  return prisma.rentalSpace.create({
    data: {
      ...data,
      vendorId
    }
  });
};

export const getRentalSpaceById = async (id) => {
  return prisma.rentalSpace.findUnique({
    where: { id },
    include: { vendor: true }
  });
};

export const updateRentalSpace = async (id, data) => {
  return prisma.rentalSpace.update({
    where: { id },
    data
  });
};

export const deleteRentalSpace = async (id) => {
  return prisma.rentalSpace.update({
    where: { id },
    data: { availability: 'unavailable' }
  });
};

export const listRentalSpaces = async (query) => {
  const { page = 1, limit = 10, search, radius, lat, lng } = query;
  const skip = (page - 1) * limit;

  const where = { availability: 'active' };

  if (search) {
    where.OR = [
      { location: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { size: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (radius && lat && lng) {
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const radiusKm = parseFloat(radius);
    const earthRadiusKm = 6371;
    const latDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI);
    const lngDelta = (radiusKm / earthRadiusKm) * (180 / Math.PI) / Math.cos(latNum * (Math.PI / 180));

    where.latitude = { gte: latNum - latDelta, lte: latNum + latDelta };
    where.longitude = { gte: lngNum - lngDelta, lte: lngNum + lngDelta };
  }

  const [data, total] = await Promise.all([
    prisma.rentalSpace.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      include: {
        vendor: {
          select: { farmName: true, latitude: true, longitude: true }
        }
      }
    }),
    prisma.rentalSpace.count({ where })
  ]);

  return { data, total, page: Number(page), limit: Number(limit) };
};

export const getVendorRentals = async (vendorId, query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [totalRentals, activeRentals, recentRentals] = await Promise.all([
    prisma.rentalSpace.count({ where: { vendorId } }),
    prisma.rentalSpace.count({ where: { vendorId, availability: 'active' } }),
    prisma.rentalSpace.findMany({
      where: { vendorId },
      orderBy: { createdAt: 'desc' },
      skip: Number(skip),
      take: Number(limit)
    })
  ]);
  
  return { totalRentals, activeRentals, recentRentals, page: Number(page), limit: Number(limit) };
};

export const getAdminRentals = async (query = {}) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const [totalRentals, activeRentals, recentRentals] = await Promise.all([
    prisma.rentalSpace.count(),
    prisma.rentalSpace.count({ where: { availability: 'active' } }),
    prisma.rentalSpace.findMany({
      orderBy: { createdAt: 'desc' },
      skip: Number(skip),
      take: Number(limit),
      include: {
        vendor: { select: { farmName: true, user: { select: { name: true, email: true } } } }
      }
    })
  ]);
  
  return { totalRentals, activeRentals, recentRentals, page: Number(page), limit: Number(limit) };
};
