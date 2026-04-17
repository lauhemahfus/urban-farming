import argon2 from 'argon2';

export const hashPassword = async (password) => {
    return argon2.hash(password);
};

export const comparePassword = async (password, hashedPassword) => {
    return argon2.verify(hashedPassword, password);
};
