const { db } = require('../config/database');

class WishlistModel {
  static add(userId, productId) {
    const stmt = db.prepare(`
      INSERT INTO wishlist (user_id, product_id)
      VALUES (?, ?)
    `);
    const result = stmt.run(userId, productId);
    return result.lastInsertRowid;
  }

  static remove(userId, productId) {
    return db.prepare(`
      DELETE FROM wishlist 
      WHERE user_id = ? AND product_id = ?
    `).run(userId, productId);
  }

  static findById(id) {
    return db.prepare(`
      SELECT w.*, p.* 
      FROM wishlist w
      LEFT JOIN products p ON w.product_id = p.id
      WHERE w.id = ?
    `).get(id);
  }

  static getByUserId(userId) {
    return db.prepare(`
      SELECT w.id, w.user_id, w.created_at, p.* 
      FROM wishlist w
      LEFT JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(userId);
  }

  static isInWishlist(userId, productId) {
    const result = db.prepare(`
      SELECT COUNT(*) as count 
      FROM wishlist 
      WHERE user_id = ? AND product_id = ?
    `).get(userId, productId);

    return result.count > 0;
  }

  static getCount(userId) {
    return db.prepare(`
      SELECT COUNT(*) as count 
      FROM wishlist 
      WHERE user_id = ?
    `).get(userId).count;
  }
}

module.exports = WishlistModel;
