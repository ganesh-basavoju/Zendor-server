import crypto from 'crypto';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import { generateToken } from '../lib/generateToken.js';
import sendEmail from '../utils/emailService.js';

// Register new user
export const register = async (req, res, next) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new AppError('Email already in use', 400));
        }

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'customer' // Default role if not provided
        });

        generateToken(newUser, 200, res);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

// Login user
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if email and password exist
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        generateToken(user, 200, res);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};


export const logout = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

// Get current user
export const getMe = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: { user: req.user }
    });
};


// Forgot password
export const forgotPassword = async (req, res, next) => {
    try {
        if (!req.body.email) {
            return next(new AppError('Please provide your email address', 400));
        }

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return next(new AppError('No user found with that email address', 404));
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save({ validateBeforeSave: false });

        // Create reset URL - fix the URL to match your actual frontend reset page
        const resetURL = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        
        const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
        
        try {
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                message,
                html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                    <h2 style="color: #333;">Password Reset</h2>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p>If you didn't request this, you can safely ignore this email.</p>
                    <p>This link is valid for 10 minutes.</p>
                    <p>Regards,<br>The Zendorr Team</p>
                </div>
                `
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return next(new AppError('There was an error sending the email. Try again later!', 500));
        }
    } catch (error) {
        next(new AppError('Error processing your request. Please try again.', 500));
    }
};

// Reset password
export const resetPassword = async (req, res, next) => {
    try {
        if (!req.params.token) {
            return next(new AppError('Reset token is required', 400));
        }

        if (!req.body.password) {
            return next(new AppError('New password is required', 400));
        }

        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return next(new AppError('Token is invalid or has expired', 400));
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        generateToken(user, 200, res);
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};