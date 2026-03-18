const ProductModel = require('../models/productModel');

const productController = {
  // Create product (Farmer only)
  create: (req, res) => {
    try {
      const { name, price, category, image, description } = req.body;

      if (!name || !price || !category) {
        return res.status(400).json({
          success: false,
          message: 'Name, price, and category are required'
        });
      }

      const productId = ProductModel.create(
        name,
        parseFloat(price),
        category,
        image || '',
        description || '',
        req.user.id
      );

      const product = ProductModel.findById(productId);

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get all products
  getAll: (req, res) => {
    try {
      const { search, category, sort, page = 1, limit = 10 } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const products = ProductModel.getAll({
        search,
        category,
        sort,
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get single product
  getById: (req, res) => {
    try {
      const product = ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Update product (Farmer only)
  update: (req, res) => {
    try {
      const product = ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership (farmer must be the owner)
      if (product.farmer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You can only update your own products'
        });
      }

      const updatedProduct = ProductModel.updateById(req.params.id, req.body);

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Delete product
  delete: (req, res) => {
    try {
      const product = ProductModel.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      // Check ownership (farmer must be the owner)
      if (product.farmer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own products'
        });
      }

      ProductModel.deleteById(req.params.id);

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get farmer's products
  getFarmerProducts: (req, res) => {
    try {
      const products = ProductModel.getAll({
        farmerId: req.user.id
      });

      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      console.error('Get farmer products error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = productController;
