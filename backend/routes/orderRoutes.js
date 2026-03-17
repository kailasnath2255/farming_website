const express = require('express');
const orderController = require('../controllers/orderController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, orderController.create);
router.get('/my-orders', authMiddleware, roleMiddleware(['buyer']), orderController.getBuyerOrders);
router.get('/farmer-orders', authMiddleware, roleMiddleware(['farmer']), orderController.getFarmerOrders);
router.get('/:id', authMiddleware, orderController.getById);
router.put('/:id/status', authMiddleware, orderController.updateStatus);

// Admin routes
router.get('/', authMiddleware, roleMiddleware(['admin']), orderController.getAll);

module.exports = router;
