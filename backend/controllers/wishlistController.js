const WishlistModel = require('../models/wishlistModel');
const ProductModel = require('../models/productModel');

const wishlistController = {
  // Add to wishlist
  add: (req, res) => {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: 'Product ID is required'
        });
      }

      // Check if product exists
      const product = ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check if already in wishlist
      if (WishlistModel.isInWishlist(req.user.id, productId)) {
        return res.status(400).json({
          success: false,
          message: 'Product already in wishlist'
        });
      }

      const wishlistId = WishlistModel.add(req.user.id, productId);
      const wishlist = WishlistModel.findById(wishlistId);

      res.status(201).json({
        success: true,
        message: 'Product added to wishlist',
        data: wishlist
      });
    } catch (error) {
      console.error('Add to wishlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get user's wishlist
  getAll: (req, res) => {
    try {
      const wishlist = WishlistModel.getByUserId(req.user.id);

      res.json({
        success: true,
        data: wishlist
      });
    } catch (error) {
      console.error('Get wishlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Remove from wishlist
  remove: (req, res) => {
    try {
      const { productId } = req.params;

      if (!WishlistModel.isInWishlist(req.user.id, productId)) {
        return res.status(404).json({
          success: false,
          message: 'Product not in wishlist'
        });
      }

      WishlistModel.remove(req.user.id, productId);

      res.json({
        success: true,
        message: 'Product removed from wishlist'
      });
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Check if in wishlist
  check: (req, res) => {
    try {
      const { productId } = req.params;
      const inWishlist = WishlistModel.isInWishlist(req.user.id, productId);

      res.json({
        success: true,
        data: { inWishlist }
      });
    } catch (error) {
      console.error('Check wishlist error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = wishlistController;
