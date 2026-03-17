const express = require('express');
const adminController = require('../controllers/adminController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, roleMiddleware(['admin']));

// User management
router.get('/users', adminController.getUsers);
router.delete('/users/:id', adminController.deleteUser);

// Product management
router.get('/products', adminController.getProducts);
router.delete('/products/:id', adminController.deleteProduct);

// Order management
router.get('/orders', adminController.getOrders);

// Analytics
router.get('/analytics', adminController.getAnalytics);

module.exports = router;
