import { db as prisma } from '../config/prisma.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { BadRequestError, NotFoundError } from '../utils/errors.js';

export const registerUser = async (userData) => {
    const { name, email, password, role, phone } = userData;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new BadRequestError('An account with this email already exists.');
    }

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    return user;
};

export const loginUser = async (credentials) => {
    const { email, password } = credentials;
    const user = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!user) {
        throw new NotFoundError('User not found');
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new BadRequestError('Invalid credentials');
    }
    return user;
};

export const createRefreshToken = async (token, userId) => {
    return prisma.refreshToken.create({
        data: {
            token: token,
            userId: userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
    });
};

export const findRefreshToken = async (token) => {
    return prisma.refreshToken.findFirst({
        where: {
            token: token,
            expiresAt: {
                gt: new Date()
            }
        }
    });
};

export const findUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    if (!user) {
        throw new NotFoundError('User not found');
    }
    return user;
};
