const { db } = require('../config/database');

class ReviewModel {
  static create(productId, userId, rating, comment) {
    const stmt = db.prepare(`
      INSERT INTO reviews (product_id, user_id, rating, comment)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(productId, userId, rating, comment);
    return result.lastInsertRowid;
  }

  static findById(id) {
    return db.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `).get(id);
  }

  static getByProductId(productId) {
    return db.prepare(`
      SELECT r.*, u.name as user_name 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ?
      ORDER BY r.created_at DESC
    `).all(productId);
  }

  static getByUserId(userId) {
    return db.prepare(`
      SELECT r.*, p.name as product_name 
      FROM reviews r
      LEFT JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
    `).all(userId);
  }

  static getUserProductReview(productId, userId) {
    return db.prepare(`
      SELECT * FROM reviews 
      WHERE product_id = ? AND user_id = ?
    `).get(productId, userId);
  }

  static updateById(id, rating, comment) {
    const stmt = db.prepare(`
      UPDATE reviews 
      SET rating = ?, comment = ? 
      WHERE id = ?
    `);
    stmt.run(rating, comment, id);
    return this.findById(id);
  }

  static deleteById(id) {
    return db.prepare('DELETE FROM reviews WHERE id = ?').run(id);
  }

  static canUserReview(productId, userId) {
    // Check if user purchased this product
    const purchase = db.prepare(`
      SELECT COUNT(*) as count 
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = ? 
      AND o.buyer_id = ? 
      AND o.status = 'Delivered'
    `).get(productId, userId);

    return purchase.count > 0;
  }
}

module.exports = ReviewModel;
