import Product from '../models/products.js';

// Get all products with filtering and sorting
const getProducts = async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, color, size, sortBy } = req.query;

    // Build filter object dynamically
    const filter = {};

    if (category) filter.category = category.toLowerCase();
    if (brand) filter.brand = brand;
    if (color) filter['attributes.color'] = { $in: Array.isArray(color) ? color : [color] };
    if (size) filter['attributes.size'] = { $in: Array.isArray(size) ? size : [size] };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case 'price-asc':
        sort = { price: 1 };
        break;
      case 'price-desc':
        sort = { price: -1 };
        break;
      case 'name-asc':
        sort = { name: 1 };
        break;
      case 'name-desc':
        sort = { name: -1 };
        break;
      case 'newest':
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 }; // Default: newest first
    }

    const products = await Product.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

// Create new product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock, images, attributes } = req.body;

    console.log('Creating product with data:', {
      name,
      description,
      price,
      category,
      brand,
      stock,
      imageCount: images?.length || 0,
      attributes
    });

    // Validation
    if (!name || !description || !price || !category || !brand) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, price, category, brand'
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category: category.toLowerCase(),
      brand,
      stock: stock || 0,
      images: images || [],
      attributes: attributes || { color: [], size: [] }
    });

    console.log('Product created successfully:', product._id);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error details:', error.message);
    if (error.name === 'ValidationError') {
      console.error('Validation errors:', error.errors);
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Ensure category is lowercase if provided
    if (updates.category) {
      updates.category = updates.category.toLowerCase();
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};

// Get filter options (for populating filter UI)
const getFilterOptions = async (req, res) => {
  try {
    const [brands, colors, sizes, priceRange] = await Promise.all([
      Product.distinct('brand'),
      Product.distinct('attributes.color'),
      Product.distinct('attributes.size'),
      Product.aggregate([
        {
          $group: {
            _id: null,
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        }
      ])
    ]);

    res.status(200).json({
      success: true,
      filters: {
        brands: brands.sort(),
        colors: colors.filter(c => c).sort(),
        sizes: sizes.filter(s => s).sort(),
        priceRange: priceRange[0] || { minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch filter options',
      error: error.message
    });
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFilterOptions
};
