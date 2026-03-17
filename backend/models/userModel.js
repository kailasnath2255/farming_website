const { db } = require('../config/database');
const bcrypt = require('bcrypt');

class UserModel {
  static create(name, email, password, role = 'buyer') {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, hashedPassword, role);
    return result.lastInsertRowid;
  }

  static findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static findById(id) {
    return db.prepare('SELECT id, name, email, role, phone, address, verified, created_at FROM users WHERE id = ?').get(id);
  }

  static getAll() {
    return db.prepare('SELECT id, name, email, role, verified, created_at FROM users').all();
  }

  static updateById(id, updates) {
    const allowedFields = ['name', 'phone', 'address', 'password'];
    const updates_obj = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        updates_obj[key] = key === 'password' ? bcrypt.hashSync(value, 10) : value;
      }
    }

    const fields = Object.keys(updates_obj).map(f => `${f} = ?`).join(', ');
    const values = Object.values(updates_obj);
    
    const stmt = db.prepare(`UPDATE users SET ${fields} WHERE id = ?`);
    stmt.run(...values, id);
    return this.findById(id);
  }

  static deleteById(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  static verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  static getFarmerCount() {
    return db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'farmer'").get().count;
  }

  static getBuyerCount() {
    return db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'buyer'").get().count;
  }
}

module.exports = UserModel;
