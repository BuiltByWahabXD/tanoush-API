import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import ProductsController from '../controllers/products.js';

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

// Public routes
router.get('/', ProductsController.getProducts); // Get all products with filters
router.get('/filters', ProductsController.getFilterOptions); // Get filter options
router.get('/:id', ProductsController.getProductById); // Get single product

// Admin-only routes
router.post('/', protect, adminOnly, ProductsController.createProduct); // Create product
router.put('/:id', protect, adminOnly, ProductsController.updateProduct); // Update product
router.delete('/:id', protect, adminOnly, ProductsController.deleteProduct); // Delete product

export default router;
