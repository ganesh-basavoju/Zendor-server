import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';

export const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError('Please log in to access this route', 401));
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('User no longer exists', 401));
        }

        req.user = currentUser;
        next();
    } catch (error) {
        next(new AppError('Authentication failed', 401));
    }
};

export const authorize  = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    };
};