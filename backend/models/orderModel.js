const { db } = require('../config/database');

class OrderModel {
  static create(buyerId, total, paymentMethod) {
    const stmt = db.prepare(`
      INSERT INTO orders (buyer_id, total, payment_method)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(buyerId, total, paymentMethod);
    return result.lastInsertRowid;
  }

  static addItem(orderId, productId, quantity, price) {
    const stmt = db.prepare(`
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(orderId, productId, quantity, price);
  }

  static findById(id) {
    return db.prepare(`
      SELECT * FROM orders WHERE id = ?
    `).get(id);
  }

  static findByBuyerId(buyerId) {
    return db.prepare(`
      SELECT o.* 
      FROM orders o 
      WHERE o.buyer_id = ? 
      ORDER BY o.created_at DESC
    `).all(buyerId);
  }

  static getOrderItems(orderId) {
    return db.prepare(`
      SELECT oi.*, p.name, p.category, p.image 
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(orderId);
  }

  static getByFarmerId(farmerId) {
    return db.prepare(`
      SELECT DISTINCT o.* 
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.farmer_id = ? 
      ORDER BY o.created_at DESC
    `).all(farmerId);
  }

  static getAll(options = {}) {
    let query = 'SELECT * FROM orders WHERE 1=1';
    const params = [];

    if (options.status) {
      query += ' AND status = ?';
      params.push(options.status);
    }

    query += ' ORDER BY created_at DESC';

    if (options.limit || options.offset) {
      const limit = options.limit || 10;
      const offset = options.offset || 0;
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    return db.prepare(query).all(...params);
  }

  static updateStatus(orderId, status) {
    const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    stmt.run(status, orderId);
    return this.findById(orderId);
  }

  static getCount() {
    return db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
  }

  static getTotalRevenue() {
    return db.prepare(`
      SELECT SUM(total) as revenue 
      FROM orders 
      WHERE status = 'Delivered'
    `).get().revenue || 0;
  }

  static getMonthlyRevenue() {
    return db.prepare(`
      SELECT SUM(total) as revenue 
      FROM orders 
      WHERE status = 'Delivered' 
      AND strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
    `).get().revenue || 0;
  }
}

module.exports = OrderModel;
