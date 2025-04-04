import User from '../models/userModel.js';
import AppError from '../utils/appError.js';

class UserController {
  async getMe(req, res) {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      res.status(200).json(user);
    } catch (error) {
        return next(new AppError('Error occured while retrieving user details', 501));
    }
  }
  async updateMe(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');
      if (!user) {
        return next(new AppError('User not found', 404));
      }
      res.status(200).json(user);
    } catch (error) {
        return next(new AppError('Error occured while updating user details', 501));
    }
    
  }
  async deleteMe(req, res) {
    try {
      await User.findByIdAndDelete(req.user._id);
      res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        return next(new AppError('Error occured while deleting user details', 501));
    }
  }
}

export default new UserController();