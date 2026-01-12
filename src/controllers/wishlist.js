import Wishlist from '../models/wishlist.js';
import Product from '../models/products.js';

// Get user's wishlist with product details
export const getWishlist = async (req, res, next) => {
  try {
    const wishlistItems = await Wishlist.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });

    // Filter out any items where product was deleted
    const validItems = wishlistItems.filter(item => item.product !== null);

    res.json({
      success: true,
      count: validItems.length,
      data: validItems
    });
  } catch (error) {
    next(error);
  }
};

// Add product to wishlist
export const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({
      user: req.user.id,
      product: productId
    });

    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: 'Product already in wishlist'
      });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      product: productId
    });

    const populatedItem = await Wishlist.findById(wishlistItem._id).populate('product');

    res.status(201).json({
      success: true,
      message: 'Product added to wishlist',
      data: populatedItem
    });
  } catch (error) {
    next(error);
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: productId
    });

    if (!wishlistItem) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    res.json({
      success: true,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    next(error);
  }
};

// Check if product is in user's wishlist
export const checkWishlistStatus = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      user: req.user.id,
      product: productId
    });

    res.json({
      success: true,
      isInWishlist: !!wishlistItem
    });
  } catch (error) {
    next(error);
  }
};
