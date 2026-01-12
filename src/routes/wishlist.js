import express from 'express';
import * as wishlistController from '../controllers/wishlist.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

// Get user's wishlist
router.get('/', wishlistController.getWishlist);

// Check if product is in wishlist
router.get('/check/:productId', wishlistController.checkWishlistStatus);

// Add product to wishlist
router.post('/:productId', wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
