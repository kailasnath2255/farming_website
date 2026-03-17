const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database setup
const { initializeDatabase, seedDatabase } = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path} - Headers:`, req.headers);
  console.log(`📨 Body:`, req.body);
  next();
});

// Initialize database
console.log('🔧 Initializing database...');
initializeDatabase();
seedDatabase();

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Market Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      products: {
        list: 'GET /api/products',
        create: 'POST /api/products'
      },
      orders: {
        list: 'GET /api/orders',
        create: 'POST /api/orders'
      },
      reviews: 'POST /api/reviews',
      wishlist: 'GET|POST /api/wishlist'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Market Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Farmer Market Backend Server Running`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n📚 API Endpoints:`);
  console.log(`   POST   /api/auth/register`);
  console.log(`   POST   /api/auth/login`);
  console.log(`   GET    /api/auth/me`);
  console.log(`   GET    /api/products`);
  console.log(`   POST   /api/products (Farmer)`);
  console.log(`   GET    /api/orders/my-orders`);
  console.log(`   POST   /api/orders`);
  console.log(`   GET    /api/reviews/product/:id`);
  console.log(`   POST   /api/reviews`);
  console.log(`   GET    /api/wishlist`);
  console.log(`   POST   /api/wishlist`);
  console.log(`   GET    /api/admin/analytics (Admin)`);
  console.log(`\n🔐 Demo Credentials:`);
  console.log(`   Admin:  admin@example.com / admin123`);
  console.log(`   Buyer:  buyer@example.com / test123`);
  console.log(`   Farmer: farmer@example.com / test123`);
  console.log(`\n`);
});

module.exports = app;
