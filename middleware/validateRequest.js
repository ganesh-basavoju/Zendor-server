import { validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Format errors in a clean structure
        const formattedErrors = errors.array().map(error => ({
            field: error.path,
            message: error.msg
        }));

        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: formattedErrors
        });
    }

    next();
};