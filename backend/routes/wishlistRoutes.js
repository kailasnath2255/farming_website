const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, wishlistController.add);
router.get('/', authMiddleware, wishlistController.getAll);
router.delete('/:productId', authMiddleware, wishlistController.remove);
router.get('/check/:productId', authMiddleware, wishlistController.check);

module.exports = router;
