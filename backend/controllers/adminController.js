const UserModel = require('../models/userModel');
const ProductModel = require('../models/productModel');
const OrderModel = require('../models/orderModel');

const adminController = {
  // Get all users
  getUsers: (req, res) => {
    try {
      const users = UserModel.getAll();

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Delete user
  deleteUser: (req, res) => {
    try {
      const { id } = req.params;

      const user = UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      UserModel.deleteById(id);

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get all products
  getProducts: (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const products = ProductModel.getAll({
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

  // Delete product
  deleteProduct: (req, res) => {
    try {
      const { id } = req.params;

      const product = ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      ProductModel.deleteById(id);

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

  // Get all orders
  getOrders: (req, res) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const orders = OrderModel.getAll({
        status,
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get analytics
  getAnalytics: (req, res) => {
    try {
      const totalUsers = UserModel.getAll().length;
      const totalFarmers = UserModel.getFarmerCount();
      const totalBuyers = UserModel.getBuyerCount();
      const totalOrders = OrderModel.getCount();
      const totalRevenue = OrderModel.getTotalRevenue();
      const monthlyRevenue = OrderModel.getMonthlyRevenue();
      const totalProducts = ProductModel.getCount();

      res.json({
        success: true,
        data: {
          totalUsers,
          totalFarmers,
          totalBuyers,
          totalOrders,
          totalProducts,
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          monthlyRevenue: parseFloat(monthlyRevenue.toFixed(2))
        }
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = adminController;
