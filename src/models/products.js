import mongoose from 'mongoose';

// Product schema for e-commerce catalog
const productSchema = new mongoose.Schema(
  {
    // Basic product information
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxLength: [200, 'Product name cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxLength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative']
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['tees', 'hoodies', 'graphical-hoodies', 'basic-hoodies', 'mocknecks', 'trousers', 'shorts', 'jackets', 'coats'],
      lowercase: true
    },
    brand: {
      type: String,
      required: [true, 'Product brand is required'],
      trim: true
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    
    // Product media
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function(arr) {
          return arr.length <= 10;
        },
        message: 'Cannot have more than 10 images'
      }
    },
    
    // Product attributes for filtering
    attributes: {
      color: {
        type: [String],
        default: []
      },
      size: {
        type: [String],
        default: []
      }
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Index for efficient filtering
productSchema.index({ category: 1, brand: 1, price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual field to check if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

export default Product;
