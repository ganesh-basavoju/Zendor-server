import express from 'express';
import { body } from 'express-validator';
import { 
    register,
    login,
    logout,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// Validation middleware
const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain at least one number'),
];

const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Auth Routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/logout', logout);

//Admin Auth Route
router.post('/admin/register', registerValidation, validateRequest, authorize('admin'), register);
router.post('/admin/login', loginValidation, validateRequest, authorize('admin'), login);
router.post('/admin/logout', logout);

// Password management
router.post('/forgot-password', 
    body('email').isEmail().normalizeEmail(),
    validateRequest,
    forgotPassword
);

router.patch('/reset-password/:token',
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    validateRequest,
    resetPassword
);

// Protected routes
router.use(protect); 

export default router;