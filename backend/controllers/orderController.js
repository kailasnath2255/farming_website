const OrderModel = require('../models/orderModel');
const ProductModel = require('../models/productModel');

const orderController = {
  // Create order
  create: (req, res) => {
    try {
      const { products, paymentMethod } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Products array is required and must not be empty'
        });
      }

      if (!paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Payment method is required'
        });
      }

      // Calculate total
      let total = 0;
      const processedItems = [];

      for (const item of products) {
        const product = ProductModel.findById(item.product_id);
        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product ${item.product_id} not found`
          });
        }

        const itemTotal = product.price * item.quantity;
        total += itemTotal;
        processedItems.push({
          ...item,
          price: product.price
        });
      }

      // Create order
      const orderId = OrderModel.create(req.user.id, total, paymentMethod);

      // Add order items
      for (const item of processedItems) {
        OrderModel.addItem(orderId, item.product_id, item.quantity, item.price);
      }

      const order = OrderModel.findById(orderId);
      const orderItems = OrderModel.getOrderItems(orderId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          ...order,
          items: orderItems
        }
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get user's orders
  getBuyerOrders: (req, res) => {
    try {
      const orders = OrderModel.findByBuyerId(req.user.id);

      const ordersWithItems = orders.map(order => ({
        ...order,
        items: OrderModel.getOrderItems(order.id)
      }));

      res.json({
        success: true,
        data: ordersWithItems
      });
    } catch (error) {
      console.error('Get buyer orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get orders for farmer's products
  getFarmerOrders: (req, res) => {
    try {
      const orders = OrderModel.getByFarmerId(req.user.id);

      const ordersWithItems = orders.map(order => ({
        ...order,
        items: OrderModel.getOrderItems(order.id)
      }));

      res.json({
        success: true,
        data: ordersWithItems
      });
    } catch (error) {
      console.error('Get farmer orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get single order
  getById: (req, res) => {
    try {
      const order = OrderModel.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Check access (buyer or farmer with products in order)
      if (order.buyer_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You do not have access to this order'
        });
      }

      const items = OrderModel.getOrderItems(req.params.id);

      res.json({
        success: true,
        data: {
          ...order,
          items
        }
      });
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Update order status
  updateStatus: (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const validStatuses = ['Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const order = OrderModel.findById(req.params.id);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      // Only admin or farmer with products in order can update
      if (req.user.role !== 'admin' && order.buyer_id !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'You cannot update this order'
        });
      }

      const updatedOrder = OrderModel.updateStatus(req.params.id, status);

      res.json({
        success: true,
        message: 'Order status updated',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Update order error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  },

  // Get all orders (Admin only)
  getAll: (req, res) => {
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
      console.error('Get all orders error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  }
};

module.exports = orderController;
