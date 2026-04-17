import {
    registerUser,
    loginUser,
    createRefreshToken,
    findRefreshToken,
    findUserById
} from '../services/auth.service.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { BadRequestError } from '../utils/errors.js';

export const register = async (req, res, next) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user,
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const user = await loginUser(req.body);

        const accessToken = generateAccessToken({ id: user.id, role: user.role });
        const refreshTokenValue = generateRefreshToken({ id: user.id });

        await createRefreshToken(refreshTokenValue, user.id);

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            accessToken,
            refreshToken: refreshTokenValue,
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) {
            throw new BadRequestError('Refresh token is required');
        }

        const existingToken = await findRefreshToken(token);

        if (!existingToken) {
            throw new BadRequestError('Invalid or expired refresh token');
        }

        const user = await findUserById(existingToken.userId);

        const accessToken = generateAccessToken({ id: user.id, role: user.role });

        res.status(200).json({
            success: true,
            accessToken
        });

    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        next(error);
    }
};
