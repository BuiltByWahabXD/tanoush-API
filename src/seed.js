// Seed script to populate database with sample data
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from './models/users.js';
import Product from './models/products.js';
import { generateHash } from './utils/generateTokens.js';

const MONGODB_URL = process.env.MONGODB_URL;

// Sample products
const sampleProducts = [
  {
    name: 'Classic Black Hoodie',
    description: 'Premium cotton blend hoodie with a relaxed fit. Perfect for everyday wear.',
    price: 2499.00,
    category: 'hoodies',
    brand: 'TANOUSH',
    stock: 25,
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'],
    attributes: {
      color: ['Black', 'Gray'],
      size: ['S', 'M', 'L', 'XL', 'XXL']
    }
  },
  {
    name: 'Graphical Thunder Hoodie',
    description: 'Bold graphic design hoodie featuring unique artwork. Stand out from the crowd.',
    price: 2699.00,
    category: 'graphical-hoodies',
    brand: 'TANOUSH',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500'],
    attributes: {
      color: ['Black', 'White'],
      size: ['M', 'L', 'XL']
    }
  },
  {
    name: 'Essential Cotton Tee',
    description: 'Soft and comfortable cotton t-shirt. A wardrobe essential.',
    price: 899.00,
    category: 'tees',
    brand: 'TANOUSH',
    stock: 50,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    attributes: {
      color: ['White', 'Black', 'Gray', 'Navy'],
      size: ['S', 'M', 'L', 'XL']
    }
  },
  {
    name: 'Slim Fit Trousers',
    description: 'Modern slim fit trousers perfect for casual or smart-casual occasions.',
    price: 3299.00,
    category: 'trousers',
    brand: 'TANOUSH',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500'],
    attributes: {
      color: ['Black', 'Navy', 'Gray', 'Khaki'],
      size: ['28', '30', '32', '34', '36']
    }
  },
  {
    name: 'Comfort Fit Shorts',
    description: 'Lightweight summer shorts with a comfortable fit. Perfect for warm weather.',
    price: 1499.00,
    category: 'shorts',
    brand: 'TANOUSH',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'],
    attributes: {
      color: ['Black', 'Navy', 'Beige'],
      size: ['S', 'M', 'L', 'XL']
    }
  },
  {
    name: 'Winter Puffer Jacket',
    description: 'Warm and stylish puffer jacket for cold weather. Water-resistant outer layer.',
    price: 4999.00,
    category: 'jackets',
    brand: 'TANOUSH',
    stock: 10,
    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'],
    attributes: {
      color: ['Black', 'Navy'],
      size: ['M', 'L', 'XL', 'XXL']
    }
  },
  {
    name: 'Mockneck Long Sleeve',
    description: 'Sleek mockneck design for a modern look. Versatile and comfortable.',
    price: 1999.00,
    category: 'mocknecks',
    brand: 'TANOUSH',
    stock: 18,
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500'],
    attributes: {
      color: ['Black', 'White', 'Gray'],
      size: ['S', 'M', 'L', 'XL']
    }
  },
  {
    name: 'Wool Blend Coat',
    description: 'Elegant wool blend coat for formal occasions. Premium quality construction.',
    price: 6999.00,
    category: 'coats',
    brand: 'TANOUSH',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500'],
    attributes: {
      color: ['Black', 'Charcoal', 'Camel'],
      size: ['M', 'L', 'XL']
    }
  }
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URL);
    console.log('Connected successfully\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Existing data cleared\n');

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await generateHash('admin123');
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@tanoush.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log(`✓ Admin created: ${adminUser.email} (password: admin123)\n`);

    // Create regular user
    console.log('Creating regular user...');
    const userPassword = await generateHash('user123');
    const regularUser = await User.create({
      name: 'John Doe',
      email: 'user@tanoush.com',
      password: userPassword,
      role: 'user'
    });
    console.log(`✓ User created: ${regularUser.email} (password: user123)\n`);

    // Create products
    console.log('Creating sample products...');
    const products = await Product.insertMany(sampleProducts);
    console.log(`✓ Created ${products.length} products\n`);

    console.log('========================================');
    console.log('Database seeded successfully!');
    console.log('========================================');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@tanoush.com / admin123');
    console.log('User:  user@tanoush.com / user123');
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
