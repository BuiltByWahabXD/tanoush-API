import express from 'express';
import { signupValidator } from '../validators/signupValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import UsersController from '../controllers/users.js';

const router = express.Router();

// Middleware to check if user is admin
const adminOnly = (req, res, next) => {
  if (!req.user || (req.user.role !== 'admin' && !req.user.isAdmin)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// User Signup Route 
router.post('/signup', signupValidator, UsersController.signup);

// User Login Route
router.post('/login', UsersController.login);

// Refresh token route (no auth required - uses refresh token from cookie)
router.post('/refresh', protect, UsersController.refresh);

// Get current user (requires auth)
router.get('/me', protect, UsersController.getCurrentUser);

// Logout route (requires auth)
router.post('/logout', protect, UsersController.logout);

// Admin-only routes
router.get('/all', protect, adminOnly, UsersController.getAllUsers); // Get all users
router.delete('/:id', protect, adminOnly, UsersController.deleteUser); // Delete user

export default router;