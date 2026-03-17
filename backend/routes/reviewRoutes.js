const express = require('express');
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Public
router.get('/product/:productId', reviewController.getByProduct);

// Protected
router.post('/', authMiddleware, reviewController.create);
router.get('/', authMiddleware, reviewController.getByUser);
router.put('/:id', authMiddleware, reviewController.update);
router.delete('/:id', authMiddleware, reviewController.delete);

module.exports = router;
