const express = require('express');
const cors = require('cors');
const path = require('path');
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
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Initialize database
console.log('🔧 Initializing database...');
initializeDatabase();
seedDatabase();

// ⭐ API Routes FIRST - must come before static files!
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Farmer Market Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Cache control middleware for static files
// Prevent browser caching of HTML, JS, CSS files to ensure fresh content
app.use((req, res, next) => {
  // Don't cache HTML, JS, and JSON files
  if (req.path.match(/\.(html|js|json|css|txt)$/i)) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  } else {
    // Cache static assets (images, fonts) for 1 day
    res.set('Cache-Control', 'public, max-age=86400');
  }
  next();
});

// Serve frontend static files (HTML, CSS, JS) from parent directory
// This must come AFTER API routes so API requests aren't intercepted
app.use(express.static(path.join(__dirname, '..')));

// Serve frontend pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'register.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

app.get('/farmer', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'farmer.html'));
});

app.get('/buyer', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'buyer.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'profile.html'));
});

app.get('/wishlist', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'wishlist.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'payment.html'));
});

app.get('/invoice', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'invoice.html'));
});

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
