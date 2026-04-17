import { ForbiddenError } from '../utils/errors.js';

export const role = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
};
