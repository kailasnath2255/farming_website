const Database = require('better-sqlite3');
const path = require('path');

// Create/open database
const db = new Database(path.join(__dirname, '../database.sqlite'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Function to initialize database tables
function initializeDatabase() {
  try {
    // Create users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'buyer' CHECK(role IN ('buyer', 'farmer', 'admin')),
        phone TEXT,
        address TEXT,
        verified INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create products table
    db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        description TEXT,
        farmer_id INTEGER NOT NULL,
        stock INTEGER DEFAULT 100,
        rating REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create orders table
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_id INTEGER NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'Pending' CHECK(status IN ('Pending', 'Approved', 'Shipped', 'Delivered', 'Cancelled')),
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create order_items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        price REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Create reviews table
    db.exec(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(product_id, user_id)
      )
    `);

    // Create wishlist table
    db.exec(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(user_id, product_id)
      )
    `);

    // Create notifications table
    db.exec(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        type TEXT DEFAULT 'info',
        read INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
}

// Function to seed initial data
function seedDatabase() {
  try {
    // Check if admin user exists
    const adminExists = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@example.com');
    
    if (!adminExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      
      db.prepare(`
        INSERT INTO users (name, email, password, role, verified)
        VALUES (?, ?, ?, ?, ?)
      `).run('Admin User', 'admin@example.com', hashedPassword, 'admin', 1);
      
      console.log('✅ Admin user seeded successfully');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
    }

    // Seed demo users
    const buyerExists = db.prepare('SELECT * FROM users WHERE email = ?').get('buyer@example.com');
    if (!buyerExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = bcrypt.hashSync('test123', 10);
      
      db.prepare(`
        INSERT INTO users (name, email, password, role, verified)
        VALUES (?, ?, ?, ?, ?)
      `).run('Demo Buyer', 'buyer@example.com', hashedPassword, 'buyer', 1);
    }

    const farmerExists = db.prepare('SELECT * FROM users WHERE email = ?').get('farmer@example.com');
    if (!farmerExists) {
      const bcrypt = require('bcrypt');
      const hashedPassword = bcrypt.hashSync('test123', 10);
      
      db.prepare(`
        INSERT INTO users (name, email, password, role, verified)
        VALUES (?, ?, ?, ?, ?)
      `).run('Demo Farmer', 'farmer@example.com', hashedPassword, 'farmer', 1);
    }

    console.log('✅ Demo users seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = {
  db,
  initializeDatabase,
  seedDatabase
};
