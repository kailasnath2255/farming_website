const express = require('express');
const productController = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Protected routes (Farmer)
router.post('/', authMiddleware, roleMiddleware(['farmer']), productController.create);
router.put('/:id', authMiddleware, roleMiddleware(['farmer']), productController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['farmer', 'admin']), productController.delete);
router.get('/farmer/products', authMiddleware, roleMiddleware(['farmer']), productController.getFarmerProducts);

module.exports = router;
