const { db } = require('../config/database');

class ProductModel {
  static create(name, price, category, image, description, farmerId) {
    const stmt = db.prepare(`
      INSERT INTO products (name, price, category, image, description, farmer_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, price, category, image, description, farmerId);
    return result.lastInsertRowid;
  }

  static findById(id) {
    return db.prepare(`
      SELECT p.*, u.name as farmer_name 
      FROM products p
      LEFT JOIN users u ON p.farmer_id = u.id
      WHERE p.id = ?
    `).get(id);
  }

  static getAll(options = {}) {
    let query = `
      SELECT p.*, u.name as farmer_name 
      FROM products p
      LEFT JOIN users u ON p.farmer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (options.search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${options.search}%`, `%${options.search}%`);
    }

    if (options.category) {
      query += ` AND p.category = ?`;
      params.push(options.category);
    }

    if (options.farmerId) {
      query += ` AND p.farmer_id = ?`;
      params.push(options.farmerId);
    }

    // Sorting
    if (options.sort === 'price-low') {
      query += ` ORDER BY p.price ASC`;
    } else if (options.sort === 'price-high') {
      query += ` ORDER BY p.price DESC`;
    } else if (options.sort === 'rating') {
      query += ` ORDER BY p.rating DESC`;
    } else if (options.sort === 'newest') {
      query += ` ORDER BY p.created_at DESC`;
    }

    // Pagination
    if (options.limit || options.offset) {
      const limit = options.limit || 10;
      const offset = options.offset || 0;
      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);
    }

    return db.prepare(query).all(...params);
  }

  static updateById(id, updates) {
    const allowedFields = ['name', 'price', 'category', 'image', 'description', 'stock'];
    const updates_obj = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updates_obj[key] = value;
      }
    }

    const fields = Object.keys(updates_obj).map(f => `${f} = ?`).join(', ');
    const values = Object.values(updates_obj);
    
    const stmt = db.prepare(`UPDATE products SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
    return this.findById(id);
  }

  static deleteById(id) {
    return db.prepare('DELETE FROM products WHERE id = ?').run(id);
  }

  static updateRating(productId) {
    const result = db.prepare(`
      SELECT AVG(rating) as avg_rating 
      FROM reviews 
      WHERE product_id = ?
    `).get(productId);

    const avgRating = result.avg_rating || 0;
    db.prepare('UPDATE products SET rating = ? WHERE id = ?').run(avgRating, productId);
    return avgRating;
  }

  static getCount() {
    return db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  }

  static getTotalRevenue() {
    return db.prepare(`
      SELECT SUM(o.total) as total_revenue 
      FROM orders o 
      WHERE o.status = 'Delivered'
    `).get().total_revenue || 0;
  }
}

module.exports = ProductModel;
