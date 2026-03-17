const ReviewModel = require('../models/reviewModel');
const ProductModel = require('../models/productModel');

const reviewController = {
  // Add review
  create: (req, res) => {
    try {
      const { productId, rating, comment } = req.body;

      if (!productId || !rating) {
        return res.status(400).json({
          success: false,
          message: 'Product ID and rating are required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      // Check if user can review
      if (!ReviewModel.canUserReview(productId, req.user.id)) {
        return res.status(403).json({
          success: false,
          message: 'You can only review products you have purchased'
        });
      }

      // Check if already reviewed
      const existing = ReviewModel.getUserProductReview(productId, req.user.id);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already reviewed this product'
        });
      }

      const reviewId = ReviewModel.create(productId, req.user.id, rating, comment || '');

      // Update product rating
      ProductModel.updateRating(productId);

      const review = ReviewModel.findById(reviewId);

      res.status(201).json({
        success: true,
        message: 'Review added successfully',
        data: review
      });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get product reviews
  getByProduct: (req, res) => {
    try {
      const reviews = ReviewModel.getByProductId(req.params.productId);

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get user's reviews
  getByUser: (req, res) => {
    try {
      const reviews = ReviewModel.getByUserId(req.user.id);

      res.json({
        success: true,
        data: reviews
      });
    } catch (error) {
      console.error('Get user reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Update review
  update: (req, res) => {
    try {
      const { rating, comment } = req.body;

      if (!rating) {
        return res.status(400).json({
          success: false,
          message: 'Rating is required'
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }

      const review = ReviewModel.findById(req.params.id);
      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check ownership
      if (review.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only edit your own reviews'
        });
      }

      const updatedReview = ReviewModel.updateById(req.params.id, rating, comment || '');

      // Update product rating
      ProductModel.updateRating(review.product_id);

      res.json({
        success: true,
        message: 'Review updated successfully',
        data: updatedReview
      });
    } catch (error) {
      console.error('Update review error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Delete review
  delete: (req, res) => {
    try {
      const review = ReviewModel.findById(req.params.id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Check ownership
      if (review.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own reviews'
        });
      }

      ReviewModel.deleteById(req.params.id);

      // Update product rating
      ProductModel.updateRating(review.product_id);

      res.json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = reviewController;
