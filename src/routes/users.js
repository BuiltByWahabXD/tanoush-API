import express from 'express';
import { signupValidator } from '../validators/signupValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import UsersController from '../controllers/users.js';

const router = express.Router();

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

export default router;